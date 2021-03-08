/**
 * stripe api keys.
*/

namespace Shopaholic.Config
{
    public class StripeSettings
    {
        public string PublishKey { set; get; }

        public string SecretKey { set; get; }

        public string SigningSecret { set; get; }
    }
}
