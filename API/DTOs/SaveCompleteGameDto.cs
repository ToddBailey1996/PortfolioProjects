using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SaveCompleteGameDto : ChessGameDto
{
    [Required]
    public string StartingFen { get; set; } = "";

    public string? Result { get; set; }
    public DateTime? StartedAt { get; set; }
}
