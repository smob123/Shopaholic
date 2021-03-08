/**
 * image table in the database.
*/

using System;
using System.Text.Json.Serialization;

namespace Shopaholic.Domains.Products.Models
{
    public class ImageModel
    {
        [JsonIgnore]
        public Guid ID { set; get; }

        public string URL { set; get; }

        [JsonIgnore]
        public bool Is_thumbnail { set; get; }

        [JsonIgnore]
        public virtual ProductModel Product { set; get; }
    }
}
