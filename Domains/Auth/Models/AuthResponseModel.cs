/**
 * response to successful auth requests.
*/

namespace Shopaholic.Domains.Auth.Models
{
    public class AuthResponseModel
    {
        public string AuthToken { set; get; }

        public string AccessToken { set; get; }
    }
}
