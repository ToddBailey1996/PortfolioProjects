using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;


public class ProjectsController : BaseApiController
{

    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectListDto>>> GetProjects(){

        var isLoggedIn = User.Identity?.IsAuthenticated == true;
        var projects = await _projectService.GetProjectsAsync(isLoggedIn);
        if(projects == null)
        {
            return NotFound();
        }
        return Ok(projects);

    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Project>> GetProject(int id)
    {
        var project = await _projectService.GetProjectAsync(id);
        if (project != null)
            return Ok(project);

        return NotFound();

    }

    

}
