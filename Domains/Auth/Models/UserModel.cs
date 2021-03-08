/**
 * user table in the database.
*/

using System;
using System.Text.Json.Serialization;

namespace Shopaholic.Domains.Auth.Models
{
    public class UserModel
    {
        public Guid ID { set; get; }

        public string FirstName { set; get; }

        public string LastName { set; get; }

        [JsonIgnore]
        public string Email { set; get; }

        [JsonIgnore]
        public string Password { set; get; }

        [JsonIgnore]
        public string JWT { set; get; }

        [JsonIgnore]
        public DateTime LastLogin { set; get; }
    }
}
