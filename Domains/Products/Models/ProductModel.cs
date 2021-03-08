/**
 * product table in the database.
*/

using System;
using System.Collections.Generic;

namespace Shopaholic.Domains.Products.Models
{
    public class ProductModel
    {
        public Guid ID { set; get; }

        public string Title { set; get; }

        public string Category { set; get; }

        public string Brand { set; get; }

        public decimal Price { set; get; }

        public int DiscountPercentage { set; get; }

        public virtual ICollection<ImageModel> Images { set; get; }
    }
}
