/**
 * product review table in the databasse.
*/

using System;

namespace Shopaholic.Domains.ProductReviews.Models
{
    public class ProductReviewRequestModel
    {
       public Guid ProductId { set; get; }

        public int Rating { set; get; }

        public string Comment { set; get; }
    }
}
