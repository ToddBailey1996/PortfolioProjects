using API;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Services;
public class AuthService : IAuthService
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;

    public AuthService(
        DataContext context,
        ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<UserDto?> RegisterAsync(RegisterDto registerDto)
    {
        
        if (await _context.Users.AnyAsync(
            x => x.UserName == registerDto.Username.ToLower()))
        {
            return null;
        }

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            UserName = registerDto.Username.ToLower(),
            PasswordHash = hmac.ComputeHash(
                Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return new UserDto
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }

    public async Task<UserDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(
            x => x.UserName == loginDto.Username.ToLower());

        if (user == null) return null;

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(
            Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return null;
        }

        return new UserDto
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }
    public async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(
            x => x.UserName.ToLower() == username.ToLower());
    }

}