using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace API.DTOs;

public class ChessGameDto
{
    [Required]
    public string GameId { get; set; } = "";

    [Required]
    public string Fen { get; set; } = "";

    public List<GameMoveDto> Moves { get; set; } = [];

    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
}
