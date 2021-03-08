using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Shopaholic.Domains.Products.Models;
using Shopaholic.Repositories;

namespace Shopaholic.Domains.Products
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductsService _service;

        public ProductsController(DBContext context) => _service = new ProductsService(context);

        [HttpGet]
        public async Task<IActionResult> GetAllProducts([FromQuery] string brand, [FromQuery] string category, [FromQuery] int count)
        {
            var products = new List<ProductModel>();

            // check if count wasn't specified
            if (count < 1)
            {
                // return all products
                products = await _service.GetAllProducts(brand, category);
            }
            else
            {
                // otherwise return the specified number of products
                products = await _service.GetAllProducts(brand, category, count);
            }

            // make sure that products were fetched
            if (products == null)
            {
                return NotFound();
            }

            return Ok(new { res = products });
        }

        [HttpGet("{id}")]
        public ActionResult GetProductById(Guid id)
        {
            // try to find the product and return it
            var product = _service.GetProductById(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(new { res = product });
        }

        [HttpGet("random/{count}")]
        public async Task<IActionResult> GetRandomProducts(int count, [FromQuery] string brand, [FromQuery] string category)
        {
            // verify the count parameter
            if(count < 1)
            {
                return BadRequest(new { err = "Count cannot be less than 1" });
            }

            var products = await _service.GetRandomProducts(count, brand, category);

            return Ok(new { res = products });
        }
    }
}