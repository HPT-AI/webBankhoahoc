using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using WebBankhoahoc.Application.Interfaces;
using WebBankhoahoc.Infrastructure.Data;
using WebBankhoahoc.Infrastructure.Repositories;
using WebBankhoahoc.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Register DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration["DB_CONNECTION"]));

// Register services
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<IVideoService, VideoService>();

// Register AWS S3 client
builder.Services.AddAWSService<IAmazonS3>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
