using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;
namespace API.Services;
public class UserService : IUserService
{
    private readonly DataContext _context;

    public UserService(DataContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<UsersDto>> GetUsers()
    {
        return await _context.Users
            .Select(user => new UsersDto
            {
                Id = user.Id,
                Username = user.UserName,
                IsActive = user.IsActive,
                CreatedDate = user.CreatedDate
            })
            .ToListAsync();
    }
     public async Task<UsersDto?> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return null;

        return new UsersDto
        {
            Id = user.Id,
            Username = user.UserName,
            IsActive = user.IsActive,
            CreatedDate = user.CreatedDate
        };
    }

    public async Task<bool> UpdateUser(UsersDto userDto)
    {
        var user = await _context.Users.FindAsync(userDto.Id);

        if (user == null)
            return false;

        user.UserName = userDto.Username;
        user.IsActive = userDto.IsActive;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<UsersDto?> CreateUser(RegisterDto newUser)
    {
        if (await UserExists(newUser.Username))
            return null;

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            UserName = newUser.Username.ToLower(),
            PasswordHash = hmac.ComputeHash(
                Encoding.UTF8.GetBytes(newUser.Password)),
            PasswordSalt = hmac.Key,
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return new UsersDto
        {
            Id = user.Id,
            Username = user.UserName,
            IsActive = user.IsActive,
            CreatedDate = user.CreatedDate
        };
    }

    public async Task<bool> UpdatePassword(int id, string newPassword)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        using var hmac = new HMACSHA512();

        user.PasswordHash = hmac.ComputeHash(
            Encoding.UTF8.GetBytes(newPassword));

        user.PasswordSalt = hmac.Key;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<UsersDto?> GetUserByUsername(string username)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x =>
                x.UserName.ToLower() == username.ToLower());

        if (user == null)
            return null;

        return new UsersDto
        {
            Id = user.Id,
            Username = user.UserName,
            IsActive = user.IsActive,
            CreatedDate = user.CreatedDate
        };
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users
            .AnyAsync(x =>
                x.UserName.ToLower() == username.ToLower());
    }

}