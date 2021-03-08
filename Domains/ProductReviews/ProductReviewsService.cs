/**
 * handles verifications, and applying manipulations to the reviews db table.
*/

using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Shopaholic.Domains.ProductReviews.Models;
using Shopaholic.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Shopaholic.Domains.ProductReviews
{
    public class ProductReviewsService
    {
        private readonly DBContext _context;

        public ProductReviewsService(DBContext context) => _context = context;

        /**
         * returns a product's reviews ordered by date in a descending order.
        */
        public List<ProductReviewModel> GetReviewsByProductId(Guid id)
        {
            try
            {
                var reviews = _context.Reviews.Where(r => r.ProductId.Equals(id)).Include(r => r.User)
                    .OrderByDescending(r => r.Datetime).ToList();

                return reviews;
            }
            catch (SqlException)
            {
                return new List<ProductReviewModel>();
            }
        }

        /**
         * adds product reviews.
        */
        public ProductReviewModel AddProductReview(Guid userId, ProductReviewRequestModel reviewModel)
        {
            // create a new review model and save it
            var productReviewModel = new ProductReviewModel
            {
                ProductId = reviewModel.ProductId,
                Rating = reviewModel.Rating,
                UserId = userId,
                Datetime = DateTime.Now,
                Comment = reviewModel.Comment
            };

            _context.Reviews.Add(productReviewModel);

            _context.SaveChanges();

            // return the review model
            return _context.Reviews.Where(p => p.ID.Equals(productReviewModel.ID)).Include(r => r.User).FirstOrDefault();
        }

        /**
         * removes product reviews.
        */
        public bool RemoveReviewById(Guid userId, Guid reviewId)
        {
            // try to find the review
            var review = _context.Reviews.Where(review => review.ID.Equals(reviewId) && review.UserId.Equals(userId)).FirstOrDefault();

            if (review == null)
            {
                return false;
            }

            // remove it
            _context.Reviews.Remove(review);

            _context.SaveChanges();

            return true;
        }
    }
}
