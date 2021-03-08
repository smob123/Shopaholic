/**
 * sign up request parameters.
*/

namespace Shopaholic.Domains.Auth.Models
{
    public class SignupModel
    {
        public string Email { set; get; }

        public string FirstName { set; get; }

        public string LastName { set; get; }

        public string Password { set; get; }
    }
}
