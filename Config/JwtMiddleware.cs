/**
 * middleware to verify whether the user's cookies contain valid tokens.
*/

using Microsoft.AspNetCore.Http;
using Shopaholic.Domains.Auth;
using System;
using System.Threading.Tasks;

namespace Shopaholic.Config
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next) => _next = next;
    
        public async Task Invoke(HttpContext context, IUserService userService)
        {
            // get the jwt and user id tokens from the user's cache
            string token = context.Request.Cookies["X-Access-Token"];
            string userId = context.Request.Cookies["Auth-Token"];

            // try to attach the user's information to the current context
            if (token != null && userId != null)
            {
                AttachUserToContext(context, userService, token, userId);
            }

            await _next(context);
        }

        private void AttachUserToContext(HttpContext context, IUserService userService, string token, string userId)
        {
            try
            {
                Guid parsedId = Guid.Parse(userId);

                // validate the tokens
                if (userService.IsTokenValid(parsedId, token))
                {
                    // attach user to context
                    context.Items["User"] = userService.GetUserById(parsedId);
                }
            }
            catch { /* do nothing when catching an exception */ }
        }
    }
}