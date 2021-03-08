/**
 * handles verifications, and applying manipulations to the carts db table.
*/

using Microsoft.EntityFrameworkCore;
using Shopaholic.Domains.Carts.Models;
using Shopaholic.Domains.Products;
using Shopaholic.Domains.Products.Models;
using Shopaholic.Repositories;
using Shopaholic.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Shopaholic.Domains.Carts
{
    public class CartService
    {
        private readonly DBContext _context;
        private readonly ProductsService _productService;

        public CartService(DBContext context)
        {
            _context = context;
            _productService = new ProductsService(context);
        }

        /**
         * returns a user's cart items.
        */
        public List<CartItem> GetUsersCart(Guid userId)
        {
            // check if the user has a cart attached to their account
            CartModel cart = _context.Carts.Where(cart => cart.UserId.Equals(userId))
                .FirstOrDefault();

            // if not return an empty one
            if (cart == null)
            {
                return new List<CartItem>();
            }

            // try to get all the items attached to the user's cart
            try
            {
                return _context.CartItems
                    .Include(i => i.Product)
                    .ThenInclude(p => p.Images)
                    .ToList();
            }
            catch (SQLException)
            {
                // otherwise return an empty list
                return new List<CartItem>();
            }
        }

        /**
         * adds an item to the user's cart.
        */
        public bool AddCartItem(Guid userId, Guid itemId, int quantity)
        {
            // try to find the item in the database
            ProductModel product = _productService.GetProductById(itemId);

            if (product == null)
            {
                return false;
            }

            // check if the item already exists in the user's cart
            CartItem item = GetItemFromCart(userId, itemId);

            if (item != null)
            {
                return false;
            }

            // try to get the user's cart
            CartModel cart = _context.Carts.Where(cart => cart.UserId.Equals(userId))
                .FirstOrDefault();

            // create a new cart if the user doesn't have one
            if (cart == null)
            {
                cart = new CartModel
                {
                    UserId = userId
                };
                _context.Carts.Add(cart);
                _context.SaveChanges();
            }

            // add the item to the user's cart
            CartItem cartItem = new CartItem
            {
                Product = product,
                Quantity = quantity,
                Cart = cart
            };
            _context.CartItems.Add(cartItem);

            _context.SaveChanges();
            return true;
        }

        /**
         * updates an item's quantity in the user's cart.
        */
        public bool UpdateCartItemQuantity(Guid userId, Guid itemId, int quantity)
        {
            // try to get the item from the cart
            CartItem itemToUpdate = GetItemFromCart(userId, itemId);

            if (itemId == null)
            {
                return false;
            }

            // update its quantity and save changes
            itemToUpdate.Quantity = quantity;
            _context.SaveChanges();
            return true;
        }

        /**
         * removes an item from the user's cart.
        */
        public bool RemoveCartItem(Guid userId, Guid itemId)
        {
            // check if the item already exists in the user's cart
            CartItem itemToRemove = GetItemFromCart(userId, itemId);

            if (itemToRemove == null)
            {
                return false;
            }

            // try to remove the item
            _context.CartItems.Remove(itemToRemove);
            _context.SaveChanges();

            return true;
        }

        /**
         * returns user's purchased items.
        */
        public List<PurchaseModel> GetUserPurchases(Guid userId)
        {
            try
            {
                return _context.Purchases.Where(purchase => purchase.UserId.Equals(userId)).ToList();
            }
            catch (SQLException)
            {
                return new List<PurchaseModel>();
            }
        }

        /**
         * handles purchasing items.
        */
        public bool PurchaseItems(Guid userId)
        {
            // try to get the user's cart
            List<CartItem> cartItems = GetUsersCart(userId);

            if (cartItems.Count == 0)
            {
                return false;
            }

            // create a new purchase model to add to the database
            PurchaseModel purchaseModel = new PurchaseModel
            {
                UserId = userId,
                PurchasedAt = DateTime.Now
            };
            _context.Purchases.Add(purchaseModel);
            _context.SaveChanges();

            // add the user's cart items as purchased items
            List<PurchasedItem> purchasedItems = new List<PurchasedItem>();

            cartItems.ForEach(item =>
            {
                PurchasedItem newItem = new PurchasedItem
                {
                    PurchaseId = purchaseModel.ID,
                    Product = item.Product,
                    PurchasePrice = _productService.GetProductPrice(item.Product.ID),
                    Quantity = item.Quantity
                };

                purchasedItems.Add(newItem);
            });

            _context.PurchasedItems.AddRange(purchasedItems);

            // empty the user's cart
            _context.CartItems.RemoveRange(cartItems);

            _context.SaveChanges();

            return true;
        }

        /**
         * returns a specific item from a user's cart.
        */
        public CartItem GetItemFromCart(Guid userId, Guid itemId)
        {
            // try to get the user's cart
            CartModel cart = _context.Carts.Where(cart => cart.UserId.Equals(userId))
                .FirstOrDefault();

            if (cart == null)
            {
                return null;
            }

            // return the item if it exists
            return _context.CartItems.Include(item => item.Product)
                .Include(item => item.Cart)
                .SingleOrDefault(item => item.Product.ID.Equals(itemId) && item.Cart.ID.Equals(cart.ID));
        }
    }
}
