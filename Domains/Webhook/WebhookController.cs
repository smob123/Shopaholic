/**
 * handles stripe's checkout results.
*/

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Shopaholic.Config;
using Shopaholic.Domains.Carts;
using Shopaholic.Repositories;
using Stripe;

namespace Shopaholic.Domains.Webhook
{
    [Route("webhook")]
    [ApiController]
    public class WebhookController : ControllerBase
    {
        // used to construct a stripe event
        private readonly CartService _service;
        private readonly StripeSettings _settings;

        public WebhookController(DBContext context, IOptions<StripeSettings> settings)
        {
            _service = new CartService(context);
            _settings = settings.Value;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            try
            {
                // try to get the stripe event
                var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], _settings.SigningSecret);

                PaymentIntent intent = null;

                // check the event type
                switch (stripeEvent.Type)
                {
                    case "payment_intent.succeeded":
                        intent = (PaymentIntent)stripeEvent.Data.Object;
                        // fulfil the customer's purchase
                        Guid userId = Guid.Parse(intent.Metadata["userId"]);
                        bool purchaseComplete = _service.PurchaseItems(userId);

                        if (!purchaseComplete)
                        {
                            return BadRequest(new { err = "Could not complete the purchase request" });
                        }

                        break;
                    case "payment_intent.payment_failed":
                        intent = (PaymentIntent)stripeEvent.Data.Object;
                        // notify the customer that payment failed
                        return StatusCode(StatusCodes.Status500InternalServerError, "Payment failed");
                    default:
                        break;
                }

                // return an empty result for other types of intents
                return new EmptyResult();
            }
            catch (Exception)
            {
                // invalid Signature
                return BadRequest();
            }
        }
    }
}
