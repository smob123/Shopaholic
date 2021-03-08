/**
 * handles verifications, and applying manipulations to the orders db table.
*/

using Microsoft.EntityFrameworkCore;
using Shopaholic.Domains.Carts.Models;
using Shopaholic.Repositories;
using Shopaholic.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Shopaholic.Domains.Orders
{
    public class OrdersServices
    {
        private readonly DBContext _context;

        public OrdersServices(DBContext context) => _context = context;

        /**
         * returns a user's orders.
        */
        public List<PurchaseModel> GetUserOrders(Guid userId)
        {
            try
            {
                // get the user's purchases
                List<PurchaseModel> purchases = _context.Purchases.Where(item => item.UserId.Equals(userId))
                    .OrderByDescending(item => item.PurchasedAt)
                    .ToList();

                // include products and images
                purchases.ForEach(purchase =>
                {
                    purchase.PurchasedItems = _context.PurchasedItems.Where(item => item.PurchaseId.Equals(purchase.ID))
                    .Include(item => item.Product)
                    .ThenInclude(product => product.Images)
                    .ToList();
                });

                return purchases;

            }
            catch (SQLException)
            {
                return new List<PurchaseModel>();
            }
        }
    }
}
