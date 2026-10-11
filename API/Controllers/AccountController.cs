using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;


namespace API.Controllers;


public class AccountController/*(AppContext context, ITokenService tokenService)*/ : BaseApiController
{
        private readonly IAuthService _authService;

        public AccountController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto){

                if (await UserExists(registerDto.Username))
                {
                    return BadRequest("Username Taken.");
                }
                

            var user = await _authService.RegisterAsync(registerDto);

            return user == null ? BadRequest("Username Taken.") : user;

        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
        
            var user = await _authService.LoginAsync(loginDto);

            return user == null ? Unauthorized("Invalid Username or Password") : user;
        }

        private async Task<bool> UserExists(string username){
            return await _authService.UserExists(username);
        }
}
