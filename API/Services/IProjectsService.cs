using API;
using API.DTOs;
using API.Entities;
namespace API.Services;
public interface IProjectService
{
    public  Task<IEnumerable<ProjectListDto>> GetProjectsAsync(bool isLoggedIn);
    public  Task<Project?> GetProjectAsync(int id);


}
    