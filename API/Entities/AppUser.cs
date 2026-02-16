using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Users")] // Tells EF the table is called "Users", not "AppUsers"
public class AppUser
{
    [Key]
    [Column("UserId")] // Matches the [UserId] in your SQL screenshot
    public int Id { get; set; }

    [Column("Username")] // Match the casing in your SQL script
    public required string UserName { get; set; } 

    // IMPORTANT: Changed to string to match your nvarchar(255) SQL definition
   public required byte[] PasswordHash { get; set; }
    public required byte[] PasswordSalt { get; set; }
    
    // These exist in your SQL, so you should add them to your class
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
}