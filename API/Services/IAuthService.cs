using API;
using API.DTOs;

public interface IAuthService
{
    public Task<UserDto?> RegisterAsync(RegisterDto registerDto);
    public Task<UserDto?> LoginAsync(LoginDto loginDto);

    public Task<bool> UserExists(string username);
}