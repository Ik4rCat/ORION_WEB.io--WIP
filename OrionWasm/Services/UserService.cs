using OrionWasm.Models;

namespace OrionWasm.Services;

public class UserService
{
    public List<User> Users { get; set; } = new();

    public UserService()
    {
        // Демо-данные
        Users = new List<User>
        {
            new User
            {
                Id = 1,
                Name = "Тестовый пользователь",
                Email = "test@example.com",
                Avatar = null
            }
        };
    }

    public User? GetUser(int id) => Users.FirstOrDefault(u => u.Id == id);
} 