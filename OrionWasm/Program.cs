using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using OrionWasm;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddSingleton<OrionWasm.Services.ProjectService>();
builder.Services.AddSingleton<OrionWasm.Services.TaskService>();
builder.Services.AddSingleton<OrionWasm.Services.NoteService>();
builder.Services.AddSingleton<OrionWasm.Services.TeamService>();
builder.Services.AddSingleton<OrionWasm.Services.RepositoryService>();
builder.Services.AddSingleton<OrionWasm.Services.UserService>();

await builder.Build().RunAsync();
