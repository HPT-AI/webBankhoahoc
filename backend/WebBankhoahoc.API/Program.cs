using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using WebBankhoahoc.Application.Interfaces;
using WebBankhoahoc.Infrastructure.Data;
using WebBankhoahoc.Infrastructure.Repositories;
using WebBankhoahoc.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WebBankhoahoc API",
        Version = "v1",
        Description = "API for WebBankhoahoc course management"
    });
});

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
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebBankhoahoc API v1"));
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
