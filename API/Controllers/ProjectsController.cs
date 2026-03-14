using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;


public class ProjectsController(AppContext context) : BaseApiController
{

  

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects(){

        var isLoggedIn = User.Identity?.IsAuthenticated == true;

        var query = context.Projects.AsQueryable();
         if (!isLoggedIn)
        {
            query = query.Where(p => !p.RequiresLogin);
        }

        var projects = await query
        .Select(p => new ProjectListDto
        {
            Name = p.Name,
            Id = p.Id,
            Title = p.Title,
            TechList = p.TechList,
            Description = p.Description,
            CreatedDate = p.CreatedDate,
            RequiresLogin = p.RequiresLogin,

        }).ToListAsync();   

        
        return Ok(projects);

    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Project>> GetProject(int id)
    {
        var user = await context.Projects.FindAsync(id);
        if (user != null)
            return Ok(user);

        return NotFound();

    }

    

}
