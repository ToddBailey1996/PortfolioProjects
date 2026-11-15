using API.DTOs;
using API.Entities;

namespace API.Services;

public interface IChessService
{
    Task<CurrentGameDocument> SaveGameAsync(string userId, ChessGameDto gameDto);
    Task<CurrentGameDocument?> GetGameAsync(string userId, string gameId);
    Task<GameHistoryDocument> SaveCompleteGameAsync(string userId, SaveCompleteGameDto gameDto);
    Task<GameHistoryDocument?> GetCompleteGameAsync(string userId, string id);
}
