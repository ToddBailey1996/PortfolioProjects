using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
namespace API.Extensions;

public static class ApplicationServicesExtension
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        //services.AddCors();
        services.AddControllers();
        var cs = config.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppContext>(opt =>
{
    opt.UseSqlServer(cs, sqlOptions => 
    {
        // This enables automatic retries for transient failures
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    });
});
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        services.AddEndpointsApiExplorer();
        services.AddScoped<ITokenService,TokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IUserService, UserService>();
        var mongoConnection = config.GetConnectionString("MongoDb")
            ?? throw new InvalidOperationException("MongoDb connection string is missing.");

        services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoConnection));
        services.AddScoped<IChessService, ChessService>();
        return services;
    }
}
