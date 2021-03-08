/**
 * cart db table.
*/

using Shopaholic.Domains.Auth.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Shopaholic.Domains.Carts.Models
{
    [Table("Carts")]
    public class CartModel
    {
        [Key]
        [JsonIgnore]
        public Guid ID { set; get; }

        [ForeignKey(nameof(UserModel))]
        [JsonIgnore]
        public Guid UserId { set; get; }
    }
}
