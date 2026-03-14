using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;


public class UsersController(AppContext context) : BaseApiController
{

  
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsersDto>>> GetUsers(){
        var users = await context.Users.Select(user => new UsersDto
        {
            Id = user.Id,
            Username = user.UserName,
            IsActive = user.IsActive,
            CreatedDate = user.CreatedDate
        }).ToListAsync();
        return Ok(users);

    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsersDto>> GetUsers(int id)
    {
        var user = await context.Users.FindAsync(id);
        if (user != null)
            return Ok(new UsersDto
            {
                Id = user.Id,
                Username = user.UserName,
                IsActive = user.IsActive,
            CreatedDate = user.CreatedDate
            });

        return NotFound();

    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<bool> UpdateUser(UsersDto userDto)
    {
        var user = await context.Users.FindAsync(userDto.Id);
        if (user == null) return false;
        user.UserName = userDto.Username;
        user.IsActive = userDto.IsActive;
        context.Users.Update(user);
        await context.SaveChangesAsync();
        return true;
    }
    [Authorize]
    [HttpPost]    
    public async Task<ActionResult<UsersDto>> CreateUser(RegisterDto newUser)
    {


        if (await UserExists(newUser.Username))
                {
                    return BadRequest("Username Taken.");
                }
        using var hmac = new HMACSHA512();

        var user = new AppUser
                {
                    UserName = newUser.Username.ToLower(),
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(newUser.Password)),
                    PasswordSalt = hmac.Key,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow
                };
            
        
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return Ok(new UsersDto
        {
            Id = user.Id,
            Username = user.UserName,
            IsActive = user.IsActive,
            CreatedDate = user.CreatedDate
        });
    }
    [Authorize]
    [HttpPatch("{id:int}/updatepassword")]  
    public async Task<ActionResult> Updatepassword(int id, string newPassword)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null) return NotFound();

        using var hmac = new HMACSHA512();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(newPassword));
        user.PasswordSalt = hmac.Key;
        context.Users.Update(user);
        await context.SaveChangesAsync();
       return NoContent();
    }
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null) return NotFound();
        context.Users.Remove(user);
        await context.SaveChangesAsync();
        return Ok();
    }

    
    [HttpGet("username/{username}")]
    public async Task<ActionResult<UsersDto>> GetUserByUsername(string username)
    {   
        var user = await context.Users.FirstOrDefaultAsync(x => x.UserName.ToLower() == username.ToLower());
        if (user == null) return NotFound();
        return Ok(new UsersDto
        {
            Id = user.Id,
            Username = user.UserName,
            IsActive = user.IsActive,
            CreatedDate = user.CreatedDate
        });
    }   
     private async Task<bool> UserExists(string username){
            return await context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }
}
