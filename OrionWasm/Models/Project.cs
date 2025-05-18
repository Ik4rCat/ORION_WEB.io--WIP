namespace OrionWasm.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int? TeamId { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<int> Members { get; set; } = new();
} 