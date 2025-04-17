using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebBankhoahoc.Application.DTOs.Course;
using WebBankhoahoc.Application.Interfaces;
using WebBankhoahoc.Domain.Entities;
using WebBankhoahoc.Infrastructure.Data;

namespace WebBankhoahoc.Infrastructure.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly ApplicationDbContext _context;

    public CourseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Course> GetByIdAsync(Guid id)
    {
        return await _context.Courses.FindAsync(id);
    }

    public async Task<IEnumerable<Course>> GetAllAsync()
    {
        return await _context.Courses.ToListAsync();
    }

    public async Task<(IEnumerable<Course> Courses, int TotalCount)> GetFilteredAsync(CourseFilterRequest filter)
    {
        var query = _context.Courses.AsQueryable();

        if (!string.IsNullOrEmpty(filter.SearchTerm))
        {
            query = query.Where(c => c.Title.Contains(filter.SearchTerm) || 
                                     c.Description.Contains(filter.SearchTerm));
        }

        if (!string.IsNullOrEmpty(filter.Level))
        {
            query = query.Where(c => c.Level == filter.Level);
        }

        if (filter.MinPrice.HasValue)
        {
            query = query.Where(c => c.Price >= filter.MinPrice.Value);
        }

        if (filter.MaxPrice.HasValue)
        {
            query = query.Where(c => c.Price <= filter.MaxPrice.Value);
        }

        if (!string.IsNullOrEmpty(filter.CategoryId))
        {
            query = query.Where(c => c.CategoryId == filter.CategoryId);
        }

        var totalCount = await query.CountAsync();

        if (!string.IsNullOrEmpty(filter.SortBy))
        {
            switch (filter.SortBy.ToLower())
            {
                case "title":
                    query = filter.SortDesc ? 
                        query.OrderByDescending(c => c.Title) : 
                        query.OrderBy(c => c.Title);
                    break;
                case "price":
                    query = filter.SortDesc ? 
                        query.OrderByDescending(c => c.Price) : 
                        query.OrderBy(c => c.Price);
                    break;
                case "createdat":
                    query = filter.SortDesc ? 
                        query.OrderByDescending(c => c.CreatedAt) : 
                        query.OrderBy(c => c.CreatedAt);
                    break;
                default:
                    query = query.OrderByDescending(c => c.CreatedAt);
                    break;
            }
        }
        else
        {
            query = query.OrderByDescending(c => c.CreatedAt);
        }

        var courses = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return (courses, totalCount);
    }

    public async Task<Course> CreateAsync(Course course)
    {
        course.Id = Guid.NewGuid();
        course.CreatedAt = DateTime.UtcNow;
        course.UpdatedAt = DateTime.UtcNow;
        
        await _context.Courses.AddAsync(course);
        await _context.SaveChangesAsync();
        
        return course;
    }

    public async Task<Course> UpdateAsync(Course course)
    {
        course.UpdatedAt = DateTime.UtcNow;
        
        _context.Courses.Update(course);
        await _context.SaveChangesAsync();
        
        return course;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
        {
            return false;
        }

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Courses.AnyAsync(c => c.Id == id);
    }
}
