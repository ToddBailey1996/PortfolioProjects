namespace API.DTOs;

public class UsersDto
{
    public required int Id { get; set; }
    public required string Username {get; set;}

    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
}
