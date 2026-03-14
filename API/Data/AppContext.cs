using Microsoft.EntityFrameworkCore;
using API.DTOs;
using API.Entities;
public class AppContext : DbContext
{
    public AppContext(DbContextOptions<AppContext> options)
        : base(options)
    {
    }

    // Add only the DbSets you need for this context
    public DbSet<API.Entities.AppUser> Users { get; set; }
    public DbSet<Project> Projects { get; set; } 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Optional: configure table names or relationships if needed
        modelBuilder.Entity<AppUser>().ToTable("Users");
        modelBuilder.Entity<Project>().ToTable("Projects");
        modelBuilder.Entity<Project>(b =>
    {
        b.HasKey(p => p.Id);
        b.Property(p => p.Id)
         .UseIdentityColumn(); // <-- this ensures SQL Server uses IDENTITY
    });
   

    // Seed initial data for Projects
    modelBuilder.Entity<Project>().HasData(
        new Project { Id = 1, Name = "ChessGame", RequiresLogin = false, CreatedDate = new DateTime(2026, 2, 6),TechList = "C#,ASP.NET Core,Azure,NUnit", Description = "This is a test description", Title = "Chess Game" }
       
    );
    }
}