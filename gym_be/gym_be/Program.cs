using gym_be.Models;
using gym_be.Extensions;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Enable dynamic JSON mapping for Npgsql
NpgsqlConnection.GlobalTypeMapper.EnableDynamicJson();

builder.Services.AddDbContext<GymContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// Add services to the container.
builder.Services.AddRepositoriesAndServices();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .SetIsOriginAllowed(origin => 
            {
                // Allow localhost on any port
                if (origin.StartsWith("http://localhost:") || origin.StartsWith("https://localhost:"))
                    return true;
                
                // Allow ngrok domains
                if (origin.Contains("ngrok-free.app") || origin.Contains("ngrok.io"))
                    return true;
                
                return false;
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowAll");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
