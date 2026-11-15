namespace API.DTOs;

public class GameMoveDto
{
    public GameCoordinatesDto From { get; set; } = new();
    public GameCoordinatesDto To { get; set; } = new();
    public string Piece { get; set; } = "";
    public string? Captured { get; set; }
    public string? Promotion { get; set; }
}

public class GameCoordinatesDto
{
    public int X { get; set; }
    public int Y { get; set; }
}
