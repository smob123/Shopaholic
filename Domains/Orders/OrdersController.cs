using Microsoft.AspNetCore.Mvc;
using Shopaholic.Repositories;
using System;

namespace Shopaholic.Domains.Orders
{
    [Authorize]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly OrdersServices _service;

        public OrdersController(DBContext context) => _service = new OrdersServices(context);

        [HttpGet]
        public IActionResult GetUserOrders()
        {
            Guid userId = GetUserId();
            return Ok(new { res = _service.GetUserOrders(userId) });
        }

        private Guid GetUserId()
        {
            string strToken = Request.Cookies["Auth-Token"];
            return Guid.Parse(strToken);
        }
    }
}
