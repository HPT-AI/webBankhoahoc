using System;
using Microsoft.AspNetCore.Http;

namespace WebBankhoahoc.Application.DTOs.Course;

public class CreateCourseRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public IFormFile? ThumbnailFile { get; set; }
    public string? VideoUrl { get; set; }
    public IFormFile? VideoFile { get; set; }
}
