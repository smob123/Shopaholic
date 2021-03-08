/**
 * purchased item db table.
*/

using Shopaholic.Domains.Products.Models;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Shopaholic.Domains.Carts.Models
{
    public class PurchasedItem
    {
        public Guid ID { set; get; }

        public ProductModel Product { set; get; }

        [ForeignKey(nameof(PurchaseModel))]
        [JsonIgnore]
        public Guid PurchaseId { set; get; }

        public int Quantity { set; get; }

        public decimal PurchasePrice { set; get; }
    }
}
