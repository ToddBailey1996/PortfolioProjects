using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class ChessController : BaseApiController
{
    private readonly IChessService _chessService;

    public ChessController(IChessService chessService)
    {
        _chessService = chessService;
    }

    [HttpGet("{gameId}")]
    public async Task<ActionResult<CurrentGameDocument>> GetGame(string gameId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var game = await _chessService.GetGameAsync(userId, gameId);
        return game is null ? NotFound() : Ok(game);
    }

    [HttpPost]
    public async Task<ActionResult<CurrentGameDocument>> SaveGame(ChessGameDto gameDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var saved = await _chessService.SaveGameAsync(userId, gameDto);
        return Ok(saved);
    }

    [HttpPost("complete")]
    public async Task<ActionResult<GameHistoryDocument>> SaveCompleteGame(
        SaveCompleteGameDto gameDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var saved = await _chessService.SaveCompleteGameAsync(userId, gameDto);
        return CreatedAtAction(nameof(GetCompleteGame), new { id = saved.Id }, saved);
    }

    [HttpGet("history/{id}")]
    public async Task<ActionResult<GameHistoryDocument>> GetCompleteGame(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Unauthorized();

        var game = await _chessService.GetCompleteGameAsync(userId, id);
        return game is null ? NotFound() : Ok(game);
    }
}
