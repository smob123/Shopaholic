/**
 * product review table in the database.
*/

using Shopaholic.Domains.Auth.Models;
using Shopaholic.Domains.Products.Models;
using System;
using System.Text.Json.Serialization;

namespace Shopaholic.Domains.ProductReviews.Models
{
    public class ProductReviewModel
    {
        public Guid ID { set; get; }

        [JsonIgnore]
        public ProductModel Product { set; get; }

        public Guid ProductId { set; get; }

        [JsonIgnore]
        public Guid UserId { set; get; }

        public UserModel User { set; get; }

        public DateTime Datetime { set; get; }

        public int Rating { set; get; }

        public string Comment { set; get; }
    }
}
