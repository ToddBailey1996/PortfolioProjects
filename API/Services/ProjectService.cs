using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Services;
public class ProjectService : IProjectService
{
    private readonly AppContext _context;

    public ProjectService(AppContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<ProjectListDto>> GetProjectsAsync(bool isLoggedIn){ 

               

        var query = _context.Projects.AsQueryable();
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

        return projects;
    }
    public async Task<Project?> GetProjectAsync(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        return project;

       
    }

  
}