namespace OrionWasm.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public int? AssigneeId { get; set; }
    public DateTime? DueDate { get; set; }
    public string Priority { get; set; } = "medium";
    public string Status { get; set; } = "planned";
    public DateTime CreatedAt { get; set; }
    public int CreatedBy { get; set; }
} 