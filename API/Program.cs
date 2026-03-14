using System.Text;
using API;
using API.Data;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authentication.Certificate;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwaggerGen();
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200"));
app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles(); // <-- Ensures files from 'wwwroot' are served
// ... other code ...
app.MapFallbackToFile("index.html"); 
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppContext>();
    context.Database.Migrate(); // Ensures database exists and tables are created

    if (!context.Users.Any(u => u.UserName == "admin"))
    {
        byte[] hash, salt;
        PasswordHelper.CreatePasswordHash("Password01", out hash, out salt);

        var admin = new AppUser
        {
            UserName = "admin",
            PasswordHash = hash,
            PasswordSalt = salt,
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };

        context.Users.Add(admin);
        context.SaveChanges();
    }
}

app.Run();
