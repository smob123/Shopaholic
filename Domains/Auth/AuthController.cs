using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Http;
using Shopaholic.Config;
using Microsoft.Extensions.Options;
using Shopaholic.Domains.Auth.Models;

namespace Shopaholic.Domains.Auth
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IUserService _service;
        private readonly JWTSettings _appSetting;

        public AuthController(IUserService service, IOptions<JWTSettings> appSettings)
        {
            _service = service;
            _appSetting = appSettings.Value;
        }

        [HttpPost("signup")]
        public IActionResult SignUp([FromBody] SignupModel signupModel)
        {
            // try to signup the user
            try
            {
                AuthResponseModel model = _service.Signup(signupModel.Email, signupModel.FirstName, signupModel.LastName, signupModel.Password);
                // add cookies to the user's browser
                AddAuthCookies(model);
                return Ok();
            }
            catch (ApplicationException e)
            {
                // return exceptions thrown from the user service
                return BadRequest(new { err = e.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            // try to login
            AuthResponseModel model = _service.Login(loginModel.Email, loginModel.Password);
            if (model == null)
            {
                // return a generic error message if not successful
                return BadRequest(new { err = "Invalid Credintials" });
            }

            // otherwise add cookies to the user's browser
            AddAuthCookies(model);

            return Ok();
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // try to logout
            var strToken = Request.Cookies["Auth-Token"];
            Guid userId = Guid.Parse(strToken);

            if (_service.Logout(userId))
            {
                // delete the attatched cookies if logout was successful
                Response.Cookies.Delete("X-Access-Token");
                Response.Cookies.Delete("Auth-Token");
                return Ok();
            }

            // otherwise return an error message
            return BadRequest(new { err = "Could not logout" });
        }

        /**
         * adds auth cookies to the user's browser.
        */
        private void AddAuthCookies(AuthResponseModel model)
        {
            // add the jwt as an http only cookie to prevent retrieving it with js
            CookieOptions secureOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddSeconds(_appSetting.AccessTokenExpiration)
            };

            Response.Cookies.Append("X-Access-Token", model.AccessToken, secureOptions);


            // the auth token needs to be accessed by the frontend, so it won't be http only
            CookieOptions accessibleOptions = new CookieOptions
            {
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddSeconds(_appSetting.AccessTokenExpiration)
            };
            Response.Cookies.Append("Auth-Token", model.AuthToken, accessibleOptions);
        }
    }
}
