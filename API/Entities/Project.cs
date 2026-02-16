using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Projects")] // Tells EF the table is called "Users", not "AppUsers"
public class Project
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column("Name")] 
    public required string Name { get; set; } 


    public required bool RequiresLogin { get; set; }
    
    public required DateTime CreatedDate { get; set; }
}