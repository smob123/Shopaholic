using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shopaholic.Config;
using Shopaholic.Domains.Auth;
using Shopaholic.Repositories;
using Stripe;
using System;

namespace Shopaholic
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.AddSwaggerGen();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // configure jwt authentication
            services.Configure<JWTSettings>(Configuration.GetSection("JWTSettings"));

            // configure stripe
            services.Configure<StripeSettings>(Configuration.GetSection("Stripe"));

            // add user service interface to enable validating jwt tokens in the auth middleware
            services.AddScoped<IUserService, UserService>();

            services.AddDbContext<DBContext>(options => options.UseSqlServer(Configuration.GetConnectionString("SQLServer"), builder => {
                builder.EnableRetryOnFailure(5, TimeSpan.FromMinutes(5), null);
            }));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // configure stripe
            StripeConfiguration.ApiKey = Configuration.GetSection("Stripe")["SecretKey"];

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            // use custom authorization middleware
            app.UseAuthorization();
            app.UseMiddleware<JwtMiddleware>();

            // use swagger if the environment is development
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                });
            }

            app.UseEndpoints(endpoints =>
             {
                 endpoints.MapControllerRoute(
                     name: "default",
                     pattern: "{controller}/{action=Index}/{id?}");
             });

            app.UseSpa(spa =>
            {
                spa.Options.StartupTimeout = TimeSpan.FromMinutes(5);
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
