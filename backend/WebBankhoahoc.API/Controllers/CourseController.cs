using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebBankhoahoc.Application.DTOs.Course;
using WebBankhoahoc.Application.Interfaces;
using WebBankhoahoc.Domain.Entities;

namespace WebBankhoahoc.API.Controllers;

[ApiController]
[Route("api/courses")]
public class CourseController : ControllerBase
{
    private readonly ICourseRepository _courseRepository;
    private readonly IVideoService _videoService;

    public CourseController(ICourseRepository courseRepository, IVideoService videoService)
    {
        _courseRepository = courseRepository;
        _videoService = videoService;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateCourse([FromForm] CreateCourseRequest request)
    {
        var course = new Course
        {
            Title = request.Title,
            Description = request.Description,
            Level = request.Level,
            Price = request.Price,
            CategoryId = request.CategoryId
        };

        if (!string.IsNullOrEmpty(request.VideoUrl))
        {
            var videoInfo = await _videoService.ValidateYouTubeUrl(request.VideoUrl);
            if (!videoInfo.IsValid)
            {
                return BadRequest("Invalid YouTube URL");
            }

            course.VideoUrl = request.VideoUrl;
            course.VideoId = videoInfo.VideoId;
            course.IsYoutubeVideo = true;
            
            if (string.IsNullOrEmpty(request.ThumbnailUrl) && request.ThumbnailFile == null)
            {
                course.ThumbnailUrl = videoInfo.ThumbnailUrl;
            }
        }
        else if (request.VideoFile != null)
        {
            course.VideoUrl = await _videoService.UploadToS3(request.VideoFile);
            course.IsYoutubeVideo = false;
        }
        else
        {
            return BadRequest("Either VideoUrl or VideoFile must be provided");
        }

        if (request.ThumbnailFile != null)
        {
            course.ThumbnailUrl = await _videoService.UploadToS3(request.ThumbnailFile);
        }
        else if (!string.IsNullOrEmpty(request.ThumbnailUrl))
        {
            course.ThumbnailUrl = request.ThumbnailUrl;
        }

        var createdCourse = await _courseRepository.CreateAsync(course);
        
        return CreatedAtAction(nameof(GetCourseDetails), new { id = createdCourse.Id }, MapToResponse(createdCourse));
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateCourse(Guid id, [FromForm] UpdateCourseRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(request.Title))
            course.Title = request.Title;
            
        if (!string.IsNullOrEmpty(request.Description))
            course.Description = request.Description;
            
        if (!string.IsNullOrEmpty(request.Level))
            course.Level = request.Level;
            
        if (request.Price.HasValue)
            course.Price = request.Price.Value;
            
        if (!string.IsNullOrEmpty(request.CategoryId))
            course.CategoryId = request.CategoryId;
            
        if (request.IsActive.HasValue)
            course.IsActive = request.IsActive.Value;

        if (!string.IsNullOrEmpty(request.VideoUrl))
        {
            if (!course.IsYoutubeVideo && !string.IsNullOrEmpty(course.VideoUrl))
            {
                await _videoService.DeleteVideo(course.VideoUrl);
            }

            var videoInfo = await _videoService.ValidateYouTubeUrl(request.VideoUrl);
            if (!videoInfo.IsValid)
            {
                return BadRequest("Invalid YouTube URL");
            }

            course.VideoUrl = request.VideoUrl;
            course.VideoId = videoInfo.VideoId;
            course.IsYoutubeVideo = true;
        }
        else if (request.VideoFile != null)
        {
            if (!string.IsNullOrEmpty(course.VideoUrl))
            {
                await _videoService.DeleteVideo(course.VideoUrl);
            }

            course.VideoUrl = await _videoService.UploadToS3(request.VideoFile);
            course.IsYoutubeVideo = false;
            course.VideoId = string.Empty;
        }

        if (request.ThumbnailFile != null)
        {
            if (!string.IsNullOrEmpty(course.ThumbnailUrl) && !course.ThumbnailUrl.Contains("img.youtube.com"))
            {
                await _videoService.DeleteVideo(course.ThumbnailUrl);
            }

            course.ThumbnailUrl = await _videoService.UploadToS3(request.ThumbnailFile);
        }
        else if (!string.IsNullOrEmpty(request.ThumbnailUrl))
        {
            course.ThumbnailUrl = request.ThumbnailUrl;
        }

        var updatedCourse = await _courseRepository.UpdateAsync(course);
        
        return Ok(MapToResponse(updatedCourse));
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null)
        {
            return NotFound();
        }

        if (!course.IsYoutubeVideo && !string.IsNullOrEmpty(course.VideoUrl))
        {
            await _videoService.DeleteVideo(course.VideoUrl);
        }

        if (!string.IsNullOrEmpty(course.ThumbnailUrl) && !course.ThumbnailUrl.Contains("img.youtube.com"))
        {
            await _videoService.DeleteVideo(course.ThumbnailUrl);
        }

        await _courseRepository.DeleteAsync(id);
        
        return NoContent();
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCourses([FromQuery] CourseFilterRequest filter)
    {
        var (courses, totalCount) = await _courseRepository.GetFilteredAsync(filter);
        
        var courseResponses = courses.Select(MapToResponse).ToList();
        
        var result = new
        {
            Items = courseResponses,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
        };
        
        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCourseDetails(Guid id)
    {
        var course = await _courseRepository.GetByIdAsync(id);
        if (course == null)
        {
            return NotFound();
        }
        
        return Ok(MapToResponse(course));
    }

    private static CourseResponse MapToResponse(Course course)
    {
        return new CourseResponse
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Level = course.Level,
            Price = course.Price,
            CategoryId = course.CategoryId,
            ThumbnailUrl = course.ThumbnailUrl,
            VideoUrl = course.VideoUrl,
            CreatedAt = course.CreatedAt,
            UpdatedAt = course.UpdatedAt,
            IsActive = course.IsActive
        };
    }
}
