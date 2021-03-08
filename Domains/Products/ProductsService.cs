/**
 * handles verifications, and applying manipulations to the products db table.
*/

using Microsoft.EntityFrameworkCore;
using Shopaholic.Domains.Products.Models;
using Shopaholic.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shopaholic.Domains.Products
{
    public class ProductsService
    {
        private readonly DBContext _context;

        public ProductsService(DBContext context) => _context = context;

        /**
         * returns all products, which can be filtered by a specific brand, category, and/or count.
        */
        public async Task<List<ProductModel>> GetAllProducts(string brand, string category, int count = int.MaxValue)
        {
            List<ProductModel> products;

            products = await _context.Products
                .Where(p => brand == null || p.Brand.Equals(brand))
                .Where(p => category == null || p.Category.Equals(category))
                .Take(count)
                .Include(p => p.Images).ToListAsync();

            // include images, such that the first image is always the thumbnail image
            products.ForEach(p => p.Images = p.Images.OrderByDescending(image => image.Is_thumbnail).ToList());

            return products;
        }

        /**
         * returns a product by id.
        */
        public ProductModel GetProductById(Guid id)
        {
            var product = _context.Products.Include(p => p.Images).Where(p => p.ID.Equals(id)).FirstOrDefault();

            if (product == null)
            {
                return null;
            }

            product.Images = product.Images.OrderByDescending(i => i.Is_thumbnail).ToList();

            return product;
        }

        /**
         * returns a list of random products which can be filtered by a specific brand, category, and/or count.
        */
        public async Task<List<ProductModel>> GetRandomProducts(int count, string brand, string category)
        {
            var products = await _context.Products.OrderBy(id => Guid.NewGuid())
                .Where(p => brand == null || p.Brand.Equals(brand))
                .Where(p => category == null || p.Category.Equals(category))
                .Include(p => p.Images)
                .Take(count).ToListAsync();

            products.ForEach(p => p.Images = p.Images.OrderByDescending(image => image.Is_thumbnail).ToList());

            return products;
        }

        /**
         * returns a product's final price.
        */
        public decimal GetProductPrice(Guid productId)
        {
            // check if the product exists
            ProductModel product = GetProductById(productId);

            if (product == null)
            {
                return -1;
            }

            // check if it is not on discount
            if (product.DiscountPercentage == 0)
            {
                return product.Price;
            }

            // compute and return the discounted amount
            decimal discountAmount = Math.Floor(product.Price * product.DiscountPercentage / 100);

            return product.Price - discountAmount;
        }
    }
}
