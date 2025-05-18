using OrionWasm.Models;

namespace OrionWasm.Services;

public class ProjectService
{
    public List<Project> Projects { get; set; } = new();

    public ProjectService()
    {
        // Демо-данные
        Projects = new List<Project>
        {
            new Project
            {
                Id = 1,
                Name = "Мой первый проект",
                Description = "Демонстрационный проект для тестирования функционала",
                TeamId = null,
                CreatedAt = DateTime.Now.AddDays(-5),
                Members = new List<int> { 1 }
            },
            new Project
            {
                Id = 2,
                Name = "Разработка игры",
                Description = "Разработка игры на Unity для мобильных устройств",
                TeamId = null,
                CreatedAt = DateTime.Now.AddDays(-2),
                Members = new List<int> { 1 }
            }
        };
    }

    public void AddProject(Project project)
    {
        project.Id = Projects.Count > 0 ? Projects.Max(p => p.Id) + 1 : 1;
        project.CreatedAt = DateTime.Now;
        Projects.Add(project);
    }

    public void RemoveProject(int id)
    {
        var project = Projects.FirstOrDefault(p => p.Id == id);
        if (project != null)
            Projects.Remove(project);
    }

    public Project? GetProject(int id) => Projects.FirstOrDefault(p => p.Id == id);
} 