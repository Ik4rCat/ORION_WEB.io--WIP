using OrionWasm.Models;

namespace OrionWasm.Services;

public class NoteService
{
    public List<Note> Notes { get; set; } = new();

    public NoteService()
    {
        // Демо-данные
        Notes = new List<Note>
        {
            new Note
            {
                Id = 1,
                Title = "Идеи для игры",
                Content = "<h2>Идеи для игры</h2><p>Основная механика:</p><ul><li>Головоломки с перемещением объектов</li><li>Сбор ресурсов для создания инструментов</li><li>Система прокачки персонажа</li></ul>",
                CreatedAt = DateTime.Now.AddDays(-3),
                UpdatedAt = DateTime.Now.AddDays(-1),
                UserId = 1
            },
            new Note
            {
                Id = 2,
                Title = "Встреча команды",
                Content = "<h2>Повестка встречи</h2><p>1. Обсуждение прогресса</p><p>2. Распределение задач</p><p>3. Планирование спринта</p>",
                CreatedAt = DateTime.Now.AddDays(-2),
                UpdatedAt = DateTime.Now.AddDays(-2),
                UserId = 1
            }
        };
    }

    public void AddNote(Note note)
    {
        note.Id = Notes.Count > 0 ? Notes.Max(n => n.Id) + 1 : 1;
        note.CreatedAt = DateTime.Now;
        note.UpdatedAt = DateTime.Now;
        Notes.Add(note);
    }

    public void RemoveNote(int id)
    {
        var note = Notes.FirstOrDefault(n => n.Id == id);
        if (note != null)
            Notes.Remove(note);
    }

    public Note? GetNote(int id) => Notes.FirstOrDefault(n => n.Id == id);
} 