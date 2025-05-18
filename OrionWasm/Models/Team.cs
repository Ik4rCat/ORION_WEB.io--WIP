namespace OrionWasm.Models;

public class Team
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<int> Members { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public int CreatedBy { get; set; }
} 