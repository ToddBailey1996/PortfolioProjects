using API.DTOs;
using API.Entities;
using MongoDB.Driver;

namespace API.Services;

public class ChessService : IChessService
{
    private readonly IMongoCollection<GameHistoryDocument> _completeGames;
    private readonly IMongoCollection<CurrentGameDocument> _currentGames;

    public ChessService(IMongoClient client, IConfiguration config)
    {
        var databaseName = config["Mongo:Database"]
            ?? throw new InvalidOperationException("Mongo database name is missing.");

        var database = client.GetDatabase(databaseName);
        _completeGames = database.GetCollection<GameHistoryDocument>("GameHistory");
        _currentGames = database.GetCollection<CurrentGameDocument>("CurrentGames");
    }

    public async Task<CurrentGameDocument> SaveGameAsync(string userId, ChessGameDto gameDto)
    {
        var filter = Builders<CurrentGameDocument>.Filter.Eq(game => game.UserId, userId)
            & Builders<CurrentGameDocument>.Filter.Eq(game => game.GameId, gameDto.GameId);

        var update = Builders<CurrentGameDocument>.Update
            .Set(game => game.UserId, userId)
            .Set(game => game.GameId, gameDto.GameId)
            .Set(game => game.Fen, gameDto.Fen)
            .Set(game => game.Moves, gameDto.Moves)
            .Set(game => game.SavedAt, DateTime.UtcNow);

        await _currentGames.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });

        return await _currentGames.Find(filter).FirstAsync();
    }

    public async Task<CurrentGameDocument?> GetGameAsync(string userId, string gameId)
    {
        return await _currentGames
            .Find(game => game.UserId == userId && game.GameId == gameId)
            .FirstOrDefaultAsync();
    }

    public async Task<GameHistoryDocument> SaveCompleteGameAsync(
        string userId,
        SaveCompleteGameDto gameDto)
    {
        var completedAt = DateTime.UtcNow;
        var document = new GameHistoryDocument
        {
            UserId = userId,
            GameId = gameDto.GameId,
            Moves = gameDto.Moves,
            StartingFen = gameDto.StartingFen,
            Fen = gameDto.Fen,
            Result = gameDto.Result,
            StartedAt = gameDto.StartedAt,
            CompletedAt = completedAt
        };

        await _completeGames.InsertOneAsync(document);
        return document;
    }

    public async Task<GameHistoryDocument?> GetCompleteGameAsync(string userId, string id)
    {
        if (!MongoDB.Bson.ObjectId.TryParse(id, out _))
            return null;

        return await _completeGames
            .Find(game => game.UserId == userId && game.Id == id)
            .FirstOrDefaultAsync();
    }
}
