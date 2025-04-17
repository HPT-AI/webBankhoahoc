namespace WebBankhoahoc.Application.DTOs.Course;

public class CourseFilterRequest
{
    public string? SearchTerm { get; set; }
    public string? Level { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? CategoryId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool SortDesc { get; set; }
}
