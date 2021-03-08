/**
 * defines global db context.
*/

using Microsoft.EntityFrameworkCore;
using Shopaholic.Domains.Auth.Models;
using Shopaholic.Domains.Carts.Models;
using Shopaholic.Domains.ProductReviews.Models;
using Shopaholic.Domains.Products.Models;

namespace Shopaholic.Repositories
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options) { }

        public DbSet<ProductModel> Products { set; get; }

        public DbSet<ImageModel> Images { set; get; }

        public DbSet<ProductReviewModel> Reviews { set; get; }

        public DbSet<UserModel> Users { set; get; }

        public DbSet<CartModel> Carts { set; get; }

        public DbSet<CartItem> CartItems { set; get; }

        public DbSet<PurchaseModel> Purchases { set; get; }

        public DbSet<PurchasedItem> PurchasedItems { set; get; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // join the cartItem, and productId tables to allow including product entities inside cart item entities 
            modelBuilder.Entity<CartItem>()
                .HasKey(c => new { c.ProductId, c.CartId });
        }
    }
}
