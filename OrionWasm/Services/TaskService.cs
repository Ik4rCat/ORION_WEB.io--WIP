using OrionWasm.Models;

namespace OrionWasm.Services;

public class TaskService
{
    public List<TaskItem> Tasks { get; set; } = new();

    public TaskService()
    {
        // Демо-данные
        Tasks = new List<TaskItem>
        {
            new TaskItem
            {
                Id = 1,
                Title = "Создать прототип",
                Description = "Разработать прототип основной механики игры",
                ProjectId = 2,
                AssigneeId = 1,
                DueDate = DateTime.Now.AddDays(3),
                Priority = "high",
                Status = "in-progress",
                CreatedAt = DateTime.Now.AddDays(-1),
                CreatedBy = 1
            },
            new TaskItem
            {
                Id = 2,
                Title = "Дизайн персонажа",
                Description = "Создать концепт-арт главного персонажа",
                ProjectId = 2,
                AssigneeId = null,
                DueDate = DateTime.Now.AddDays(5),
                Priority = "medium",
                Status = "planned",
                CreatedAt = DateTime.Now.AddDays(-0.5),
                CreatedBy = 1
            },
            new TaskItem
            {
                Id = 3,
                Title = "Написать документацию",
                Description = "Создать документ с описанием проекта",
                ProjectId = 1,
                AssigneeId = 1,
                DueDate = DateTime.Now.AddDays(1),
                Priority = "low",
                Status = "completed",
                CreatedAt = DateTime.Now.AddDays(-4),
                CreatedBy = 1
            }
        };
    }

    public void AddTask(TaskItem task)
    {
        task.Id = Tasks.Count > 0 ? Tasks.Max(t => t.Id) + 1 : 1;
        task.CreatedAt = DateTime.Now;
        Tasks.Add(task);
    }

    public void RemoveTask(int id)
    {
        var task = Tasks.FirstOrDefault(t => t.Id == id);
        if (task != null)
            Tasks.Remove(task);
    }

    public TaskItem? GetTask(int id) => Tasks.FirstOrDefault(t => t.Id == id);
} 