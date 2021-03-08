/**
 * overrides the [Authorize] attribute.
*/

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Shopaholic.Domains.Auth.Models;
using System;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // check if there is a user attached to the context
        UserModel user = (UserModel) context.HttpContext.Items["User"];

        if (user == null)
        {
            context.Result = new JsonResult(new { err = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
        }
    }
}