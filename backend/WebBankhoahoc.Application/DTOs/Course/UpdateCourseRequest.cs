using System;
using Microsoft.AspNetCore.Http;

namespace WebBankhoahoc.Application.DTOs.Course;

public class UpdateCourseRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Level { get; set; }
    public decimal? Price { get; set; }
    public string? CategoryId { get; set; }
    public string? ThumbnailUrl { get; set; }
    public IFormFile? ThumbnailFile { get; set; }
    public string? VideoUrl { get; set; }
    public IFormFile? VideoFile { get; set; }
    public bool? IsActive { get; set; }
}
