using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Controllers;


public class ProjectsController(AppContext context) : BaseApiController
{

  

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects(){
        var projects = await context.Projects.ToListAsync();
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
