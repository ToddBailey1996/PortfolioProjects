namespace API.DTOs;
public class ProjectListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";

    public string Title { get; set; } = "";
    public string TechList { get; set; } = "";

    public string? Description { get; set; } = "";
    public DateTime CreatedDate { get; set; }
    public bool RequiresLogin { get; set; }
}
