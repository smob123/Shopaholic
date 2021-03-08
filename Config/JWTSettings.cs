/**
 * jwt feilds that will be used for token validation.
*/

namespace Shopaholic.Config
{
    public class JWTSettings
    {
        public string Secret { set; get; }

        public string Issuer { get; set; }
        
        public string Audience { get; set; }
        
        public int AccessTokenExpiration { get; set; }
    }
}
