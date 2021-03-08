/**
 * cart item db table.
*/

using Shopaholic.Domains.Products.Models;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Shopaholic.Domains.Carts.Models
{
    [Table("CartItems")]
    public class CartItem
    {
        public ProductModel Product { set; get; }

        public int Quantity { set; get; }

        [JsonIgnore]
        public CartModel Cart { set; get; }

        /*  required to define composite keys inside of DBContext */

        [JsonIgnore]
        public Guid ProductId { set; get; }

        [JsonIgnore]
        public Guid CartId { set; get; }
    }
}
