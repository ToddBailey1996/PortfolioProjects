using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using API.DTOs;

namespace API.Entities;

public class CurrentGameDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string GameId { get; set; } = "";
    public string UserId { get; set; } = "";
    public string Fen { get; set; } = "";
    public List<GameMoveDto> Moves { get; set; } = [];
    public DateTime SavedAt { get; set; }
}
