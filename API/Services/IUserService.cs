using API;
using API.DTOs;

namespace API.Services;
public interface IUserService
{
    Task<IEnumerable<UsersDto>> GetUsers();
    Task<UsersDto?> GetUser(int id);
    Task<bool> UpdateUser(UsersDto userDto);
    Task<UsersDto?> CreateUser(RegisterDto newUser);
    Task<bool> UpdatePassword(int id, string newPassword);
    Task<bool> DeleteUser(int id);
    Task<UsersDto?> GetUserByUsername(string username);
}