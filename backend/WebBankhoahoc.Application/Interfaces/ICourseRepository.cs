using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebBankhoahoc.Application.DTOs.Course;
using WebBankhoahoc.Domain.Entities;

namespace WebBankhoahoc.Application.Interfaces;

public interface ICourseRepository
{
    Task<Course> GetByIdAsync(Guid id);
    Task<IEnumerable<Course>> GetAllAsync();
    Task<(IEnumerable<Course> Courses, int TotalCount)> GetFilteredAsync(CourseFilterRequest filter);
    Task<Course> CreateAsync(Course course);
    Task<Course> UpdateAsync(Course course);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
