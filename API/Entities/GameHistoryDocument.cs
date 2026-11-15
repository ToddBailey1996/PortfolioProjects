using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using API.DTOs;

namespace API.Entities;

public class GameHistoryDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string GameId { get; set; } = "";
    public string UserId { get; set; } = "";
    public List<GameMoveDto> Moves { get; set; } = [];
    public string StartingFen { get; set; } = "";
    public string Fen { get; set; } = "";
    public string? Result { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime CompletedAt { get; set; }
}
