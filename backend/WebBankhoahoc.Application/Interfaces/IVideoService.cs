using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using WebBankhoahoc.Application.DTOs.Video;

namespace WebBankhoahoc.Application.Interfaces;

public interface IVideoService
{
    Task<VideoInfo> ValidateYouTubeUrl(string url);
    Task<string> UploadToS3(IFormFile file);
    Task<bool> DeleteVideo(string videoId);
}
