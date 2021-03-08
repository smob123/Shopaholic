using Microsoft.AspNetCore.Mvc;
using Shopaholic.Domains.ProductReviews.Models;
using Shopaholic.Repositories;
using System;

namespace Shopaholic.Domains.ProductReviews
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ProductReviewsController : ControllerBase
    {
        private readonly ProductReviewsService _service;

        public ProductReviewsController(DBContext context) => _service = new ProductReviewsService(context);

        [HttpGet("{id}")]
        public IActionResult GetProductById(Guid id)
        {
            var reviews = _service.GetReviewsByProductId(id);
            return Ok(new { res = reviews });
        }

        [Authorize]
        [HttpPost("addReview")]
        public IActionResult AddReview([FromBody] ProductReviewRequestModel requestModel)
        {
            // verify parameters
            if (requestModel == null)
            {
                return BadRequest(new { err = "Review parameter missing" });
            }

            if (requestModel.Rating < 1)
            {
                return BadRequest(new { err = "Rating must be larger than 0" });
            }

            if (string.IsNullOrWhiteSpace(requestModel.Comment))
            {
                return BadRequest(new { err = "Comment cannot be empty" });
            }

            // tr y to add a new review
            Guid userId = GetUserId();
            var review = _service.AddProductReview(userId, requestModel);

            if (review != null)
            {
                return Ok(new { res = review });
            }

            return BadRequest(new { err = "Review could not be added" });
        }

        [Authorize]
        [HttpDelete("removeReview")]
        public IActionResult RemoveReviewById([FromBody] Guid reviewId)
        {
            // try to remove the specified review
            var userId = GetUserId();
            bool reviewRemoved = _service.RemoveReviewById(userId, reviewId);

            if (reviewRemoved)
            {
                return Ok();
            }

            return BadRequest();
        }

        /**
         * returns the user's id from the client's cookies.
        */
        private Guid GetUserId()
        {
            string strToken = Request.Cookies["Auth-Token"];
            return Guid.Parse(strToken);
        }
    }
}
