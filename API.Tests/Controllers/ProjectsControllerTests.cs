using System.Security.Cryptography;
using API.DTOs;
using API.Services;
using Moq;
using NUnit.Framework;
using SQLitePCL;

namespace Algorithms.Test;

public class AddTwoNumbersTest
{
    
    Mock<IProjectService> _mockProjectService;
    [SetUp]
    public void Setup()
    {
        _mockProjectService = new Mock<IProjectService>();
        List<ProjectListDto>  projectListDtoLoggedIn = new List<ProjectListDto>
        {
            new ProjectListDto
            {
                Id = 1,
                Name = "Test Project",
                Description = "This is a test project that requires login",
                Title = "Test Project Title",
                RequiresLogin = true,
                TechList = "C#, .NET",
            },
             new ProjectListDto
            {
                Id = 2,
                Name = "Another Test Project",
                Description = "This is another test project that doesn't require login",
                Title = "Another Test Project Title",
                RequiresLogin = false,
                TechList = "C#, .NET",
            }
        };

        
        _mockProjectService
        .Setup(x => x.GetProjectsAsync(true))
        .ReturnsAsync(projectListDtoLoggedIn.AsEnumerable());

        _mockProjectService
        .Setup(x => x.GetProjectsAsync(false))
        .ReturnsAsync(projectListDtoLoggedIn.AsEnumerable().Where(p => !p.RequiresLogin));
    }

    [Test]
    public void LoginRequiredProjects_ReturnsOnlyProjectsRequiringLogin()
    {
        
        var result = _mockProjectService.Object.GetProjectsAsync(true).Result;

        Assert.That(result.Count() == 2);
        Assert.That(result.Contains(result.First(p => p.RequiresLogin == true)));
        Assert.That(result.Contains(result.First(p => p.Description == "This is a test project that requires login")));
    }
    [Test]
    public void LoginNotRequiredProjects_ReturnsOnlyProjectsNotRequiringLogin()
    {
        var result = _mockProjectService.Object.GetProjectsAsync(false).Result;

        Assert.That(result.Count() == 1);
        Assert.That(result.Contains(result.First(p => p.RequiresLogin == false)));
        Assert.That(result.Contains(result.First(p => p.Description == "This is another test project that doesn't require login")));

    }
}
