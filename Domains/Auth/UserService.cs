/**
 * handles verifications, and applying manipulations to the users db table.
*/

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Shopaholic.Config;
using Shopaholic.Domains.Auth.Models;
using Shopaholic.Repositories;
using Shopaholic.Services;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace Shopaholic.Domains.Auth
{
    public interface IUserService
    {
        public AuthResponseModel Signup(string email, string firstName, string lastName, string password);

        public AuthResponseModel Login(string email, string password);

        public bool Logout(Guid userId);

        public UserModel GetUserById(Guid id);

        public bool IsTokenValid(Guid userId, string token);
    }

    public class UserService : IUserService
    {
        private readonly DBContext _context;
        private readonly JWTSettings _appSetting;

        public UserService(DBContext context, IOptions<JWTSettings> appSettings)
        {
            _context = context;
            _appSetting = appSettings.Value;
        }


        /**
         * handles sign up requests.
        */
        public AuthResponseModel Signup(string email, string firstName, string lastName, string password)
        {
            // validate all inputs
            if (!IsEmailValid(email))
            {
                throw new ApplicationException("Invalid email format");
            }

            if (!IsFirstNameValid(firstName))
            {
                throw new ApplicationException("Invalid first name format");
            }

            if (!IsLastNameValid(lastName))
            {
                throw new ApplicationException("Invalid last name format");
            }

            if (!IsPasswordValid(password))
            {
                throw new ApplicationException("Invalid password format");
            }

            // check if the entered email address is already attached to another account
            var existingUser = _context.Users.SingleOrDefault(user => user.Email.Equals(email.ToUpper()));

            if (existingUser != null)
            {
                throw new ApplicationException("Email is already in use");
            }

            // create a user model and save it in the database
            DateTime now = DateTime.Now;

            UserModel newUser = new UserModel()
            {
                Email = email.ToUpper(),
                FirstName = firstName,
                LastName = lastName,
                Password = BCrypt.Net.BCrypt.HashPassword(password, 12),
                JWT = GenerateJWT(email, now.AddSeconds(_appSetting.AccessTokenExpiration)),
                LastLogin = now
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            // return an auth response if the account was successfully created
            return new AuthResponseModel
            {
                AccessToken = newUser.JWT,
                AuthToken = newUser.ID.ToString()
            };
        }

        public AuthResponseModel Login(string email, string password)
        {
            // validate input
            if (!IsEmailValid(email) || !IsPasswordValid(password))
            {
                return null;
            }

            // check if user exists
            UserModel user = _context.Users.Where(u => u.Email.Equals(email.ToUpper())).FirstOrDefault();
            if (user == null)
            {
                return null;
            }

            // verify the password
            bool isVerified = BCrypt.Net.BCrypt.Verify(password, user.Password);

            if (!isVerified)
            {
                return null;
            }

            // generate a new jwt token, and update the last login value
            DateTime now = DateTime.Now;

            user.JWT = GenerateJWT(user.Email, now.AddSeconds(_appSetting.AccessTokenExpiration));
            user.LastLogin = now;
            _context.SaveChanges();

            // return an auth response if the changes were applied successfully
            return new AuthResponseModel
            {
                AccessToken = user.JWT,
                AuthToken = user.ID.ToString()
            };
        }

        /**
         * handles logout requests.
        */
        public bool Logout(Guid userId)
        {
            // try to get the user's data
            UserModel user = _context.Users.Where(u => u.ID.Equals(userId)).FirstOrDefault();

            if (user == null)
            {
                return false;
            }

            // clear the jwt token
            user.JWT = "";
            _context.SaveChanges();
            return true;
        }

        /**
         * returns a user by id.
        */
        public UserModel GetUserById(Guid id)
        {
            try
            {
                return _context.Users.Find(id);
            }
            catch (SQLException)
            {
                return null;
            }
        }

        /**
         * validates auth tokens.
        */
        public bool IsTokenValid(Guid userId, string token)
        {
            // try to get the user from the database
            UserModel user = _context.Users.Where(u => u.ID.Equals(userId) && u.JWT.Equals(token))
                .FirstOrDefault();

            if (user == null)
            {
                return false;
            }

            // verify that the token has not expired
            DateTime lastLogin = user.LastLogin;
            DateTime now = DateTime.Now;

            bool tokenExpired = (now - lastLogin).TotalSeconds <= 0;

            return !tokenExpired;
        }

        /**
         * validates emails.
        */
        private bool IsEmailValid(string email)
        {
            return !string.IsNullOrEmpty(email) &&
                Regex.IsMatch(email, "[a-zA-Z][a-zA-Z0-9!#$%&'*+-/=?^_`|~]{0,63}@[a-zA-Z][a-zA-Z0-9-]{0,253}[a-zA-Z0-9].[a-z-A-Z]{2,3}");
        }

        /**
         * validates first names.
        */
        private bool IsFirstNameValid(string firstName)
        {
            return !string.IsNullOrEmpty(firstName) && Regex.IsMatch(firstName, "[a-zA-Z]{2,50}");
        }


        /**
         * validates last names.
        */
        private bool IsLastNameValid(string lastName)
        {
            return !string.IsNullOrEmpty(lastName) && Regex.IsMatch(lastName, "[a-zA-Z][a-zA-Z -]{0,48}[a-zA-Z]");
        }


        /**
         * validates passwords.
        */
        private bool IsPasswordValid(string password)
        {
            return !string.IsNullOrEmpty(password) && Regex.IsMatch(password, "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*<>{} ]){6,}");
        }


        /**
         * generates jwt tokens.
        */
        private string GenerateJWT(string email, DateTime expiryDate)
        {
            // get the security key from the global jwt settings
            var securityKey = Encoding.ASCII.GetBytes(_appSetting.Secret);

            // create a new token and return it
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, email)
                }),
                Expires = expiryDate,
                Issuer = _appSetting.Issuer,
                Audience = _appSetting.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(securityKey), SecurityAlgorithms.HmacSha256Signature)
            };

            return new JwtSecurityTokenHandler().CreateEncodedJwt(tokenDescriptor);
        }
    }
}
