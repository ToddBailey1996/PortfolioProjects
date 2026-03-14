using API.Data;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace API.Extensions;

public static class ApplicationServicesExtension
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddCors();
        services.AddControllers();
        var cs = config.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppContext>(opt =>
{
            // This looks for the "DefaultConnection" key in your JSON
            opt.UseSqlServer(cs);
        });
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        services.AddEndpointsApiExplorer();
        services.AddScoped<ITokenService,TokenService>();
        Console.WriteLine("CONNECTION STRING = " + cs);
        return services;
    }
}
