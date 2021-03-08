/**
 * add item to cart request parameters.
*/

using System;

namespace Shopaholic.Domains.Carts.Models
{
    public class AddItemRequestModel
    {
        public Guid ItemId { set; get; }

        public int Quantity { set; get; }
    }
}
