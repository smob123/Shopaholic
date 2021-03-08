using Microsoft.AspNetCore.Mvc;
using Shopaholic.Domains.Carts.Models;
using Shopaholic.Domains.Products;
using Shopaholic.Domains.Products.Models;
using Shopaholic.Repositories;
using Stripe.Checkout;
using System;
using System.Collections.Generic;

namespace Shopaholic.Domains.Carts
{
    [Authorize]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {

        private readonly CartService _cartService;
        private readonly ProductsService _productService;
        
        public CartController(DBContext context)
        {
            _cartService = new CartService(context);
            _productService = new ProductsService(context);
        }

        [HttpGet]
        public IActionResult GetUserCart()
        {
            Guid userId = GetUserId();
            List<CartItem> items = _cartService.GetUsersCart(userId);
            return Ok(new { res = items });
        }

        [HttpPost("addItem")]
        public IActionResult AddItemToCart([FromBody] AddItemRequestModel addItemModel)
        {
            // verify parameters
            if (addItemModel == null || addItemModel.ItemId == null || addItemModel.Quantity < 1)
            {
                return BadRequest(new { res = "Invalid parameters" });
            }

            // try to get the product by id
            ProductModel product = _productService.GetProductById(addItemModel.ItemId);

            if (product == null)
            {
                return BadRequest(new { err = "Could not add item to the cart" });
            }

            // try to add item to the user's cart
            Guid userId = GetUserId();
            bool itemAdded = _cartService.AddCartItem(userId, addItemModel.ItemId, addItemModel.Quantity);

            // return an error message if the item wasn't added
            if (!itemAdded)
            {
                return BadRequest(new { err = "Could not add item to the cart" });
            }

            return Ok();
        }

        [HttpPut("updateItemQuantity")]
        public IActionResult UpdateCartItemQuantity([FromBody] AddItemRequestModel itemModel)
        {
            // verify paramters
            if (itemModel == null || itemModel.ItemId == null || itemModel.Quantity < 1)
            {
                return BadRequest(new { res = "Invalid parameters" });
            }

            // try to update the user's cart
            Guid userId = GetUserId();
            bool valueUpdated = _cartService.UpdateCartItemQuantity(userId, itemModel.ItemId, itemModel.Quantity);

            // return an error message of the cart wasn't updated
            if (!valueUpdated)
            {
                return BadRequest(new { err = "Could update your cart" });
            }

            return Ok();
        }


        [HttpDelete("deleteItem")]
        public IActionResult DeleteItemFromCart([FromBody] Guid itemId)
        {
            // verify parameters
            if (itemId == null)
            {
                return BadRequest(new { err = "Could not remove item from the cart" });
            }

            // try to remove the item from the user's cart
            Guid userId = GetUserId();
            bool itemRemoved = _cartService.RemoveCartItem(userId,  itemId);

            if (!itemRemoved)
            {
                return BadRequest(new { err = "Could not remove item from the cart" });
            }

            return Ok();
        }

        [HttpPost("purchase")]
        public IActionResult Purchase()
        {
            // get all items in the user's cart
            Guid userId = GetUserId();
            List<CartItem> cartItems = _cartService.GetUsersCart(userId);

            if (cartItems.Count == 0)
            {
                return BadRequest(new { err = "Your cart is empty" });
            }

            // create a list of session line items to pass them to stripe
            var lineItems = new List<SessionLineItemOptions>();
            cartItems.ForEach(item =>
            {
                // get the product's price
                decimal productPrice = _productService.GetProductPrice(item.Product.ID);

                SessionLineItemOptions itemOptions = new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        // the unit amount is in cents, therefore, it needs to be multiplied by 100
                        UnitAmount = (int)(productPrice * 100),
                        // add the name of the item
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.Product.Title
                        },
                        Currency = "USD"
                    },
                    Quantity = item.Quantity
                };

                lineItems.Add(itemOptions);
            });

            // create session options
            var options = new SessionCreateOptions
            {
                // attach user's id in metadata, so that the webhook can verify it later
                PaymentIntentData = new SessionPaymentIntentDataOptions
                {
                    Metadata = new Dictionary<string, string> { { "userId", userId.ToString() } }
                },
                PaymentMethodTypes = new List<string>
                {
                  "card",
                },
                LineItems = lineItems,
                Mode = "payment",
                // take the user to the client app's homepage if the payment is successful
                SuccessUrl = $"{Request.Scheme}://{Request.Host}",
                // take the user back to the checkout page if the payment was cancelled
                CancelUrl = $"{Request.Scheme}://{Request.Host}/checkout"
            };

            var service = new SessionService();
            Session session = service.Create(options);

            return Ok(new { res = session.Id });
        }

        /**
         * gets the user id from the client cookies.
        */
        private Guid GetUserId()
        {
            string strToken = Request.Cookies["Auth-Token"];
            return Guid.Parse(strToken);
        }
    }
}
