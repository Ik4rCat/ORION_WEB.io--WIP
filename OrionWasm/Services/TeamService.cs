using OrionWasm.Models;

namespace OrionWasm.Services;

public class TeamService
{
    public List<Team> Teams { get; set; } = new();

    public TeamService()
    {
        // Демо-данные
        Teams = new List<Team>
        {
            new Team
            {
                Id = 1,
                Name = "Моя команда",
                Description = "Команда разработчиков для демонстрации",
                Members = new List<int> { 1 },
                CreatedAt = DateTime.Now.AddDays(-10),
                CreatedBy = 1
            }
        };
    }

    public void AddTeam(Team team)
    {
        team.Id = Teams.Count > 0 ? Teams.Max(t => t.Id) + 1 : 1;
        team.CreatedAt = DateTime.Now;
        Teams.Add(team);
    }

    public void RemoveTeam(int id)
    {
        var team = Teams.FirstOrDefault(t => t.Id == id);
        if (team != null)
            Teams.Remove(team);
    }

    public Team? GetTeam(int id) => Teams.FirstOrDefault(t => t.Id == id);
} 