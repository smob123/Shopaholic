/**
 *  purchase db table.
*/

using Shopaholic.Domains.Auth.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Shopaholic.Domains.Carts.Models
{
    [Table("Purchases")]
    public class PurchaseModel
    {
        [Key]
        [JsonIgnore]
        public Guid ID { set; get; }

        public DateTime PurchasedAt { set; get; }

        [NotMapped]
        public List<PurchasedItem> PurchasedItems { set; get; }

        [ForeignKey(nameof(UserModel))]
        [JsonIgnore]
        public Guid UserId { set; get; }
    }
}
