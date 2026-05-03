using System.Text;
using Microsoft.AspNetCore.Authentication.Certificate;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class IdentityServiceEntensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme)
        .AddCertificate();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            var tokenkey = config["TokenKey"] ?? throw new Exception("tokenKey not found");
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenkey)),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });
       /* services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
         .AddJwtBearer(options =>
        {
            options.Authority = "https://your-auth-provider.com"; // e.g. Auth0, Azure AD

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = "https://your-auth-provider.com",

                ValidateAudience = true,
                ValidAudience = "your-api",

                ValidateIssuerSigningKey = true
            };
        });*/
        return services;
    }
}
