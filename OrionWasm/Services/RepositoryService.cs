using OrionWasm.Models;

namespace OrionWasm.Services;

public class RepositoryService
{
    public List<Repository> Repositories { get; set; } = new();

    public RepositoryService()
    {
        // Демо-данные
        Repositories = new List<Repository>
        {
            new Repository
            {
                Id = 1,
                Url = "https://github.com/user/demo-project.git",
                Name = "demo-project"
            }
        };
    }

    public void AddRepository(Repository repo)
    {
        repo.Id = Repositories.Count > 0 ? Repositories.Max(r => r.Id) + 1 : 1;
        Repositories.Add(repo);
    }

    public void RemoveRepository(int id)
    {
        var repo = Repositories.FirstOrDefault(r => r.Id == id);
        if (repo != null)
            Repositories.Remove(repo);
    }

    public Repository? GetRepository(int id) => Repositories.FirstOrDefault(r => r.Id == id);
} 