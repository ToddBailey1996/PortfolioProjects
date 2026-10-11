using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;


public class UsersController(IUserService userService) : BaseApiController
{

  
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsersDto>>> GetUsers(){
        var users = await userService.GetUsers();

        return Ok(users);

    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsersDto>> GetUsers(int id)
    {
         var user = await userService.GetUser(id);

        if (user == null)
            return NotFound();

        return Ok(user);

    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateUser(int id, UsersDto userDto)
    {
       userDto.Id = id;

        var updated = await userService.UpdateUser(userDto);

        if (!updated)
            return NotFound();

        return NoContent();
    }
    [Authorize]
    [HttpPost]    
    public async Task<ActionResult<UsersDto>> CreateUser(RegisterDto newUser)
    {


                var user = await userService.CreateUser(newUser);

        if (user == null)
            return BadRequest("Username Taken.");

        return Ok(user);
    }
    [Authorize]
    [HttpPatch("{id:int}/updatepassword")]  
    public async Task<ActionResult> Updatepassword(int id, string newPassword)
    {
        var updated = await userService.UpdatePassword(id, newPassword);

        if (!updated)
            return NotFound();

        return NoContent();
    }
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var deleted = await userService.DeleteUser(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }

    
    [HttpGet("username/{username}")]
    public async Task<ActionResult<UsersDto>> GetUserByUsername(string username)
    {   
               var user = await userService.GetUserByUsername(username);

        if (user == null)
            return NotFound();

        return Ok(user);

    }   
     
}
