using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using WebBankhoahoc.Application.DTOs.Video;
using WebBankhoahoc.Application.Interfaces;

namespace WebBankhoahoc.Infrastructure.Services;

public class VideoService : IVideoService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public VideoService(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _bucketName = configuration["AWS_BUCKET"] ?? throw new ArgumentNullException("AWS_BUCKET configuration is missing");
    }

    public async Task<VideoInfo> ValidateYouTubeUrl(string url)
    {
        var youtubeIdRegex = new Regex(@"(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^""&?\/\s]{11})");
        var match = youtubeIdRegex.Match(url);

        if (!match.Success)
        {
            return new VideoInfo { IsValid = false };
        }

        var videoId = match.Groups[1].Value;

        return new VideoInfo
        {
            VideoId = videoId,
            Title = "YouTube Video", // In real implementation, get from YouTube API
            ThumbnailUrl = $"https://img.youtube.com/vi/{videoId}/maxresdefault.jpg",
            IsValid = true
        };
    }

    public async Task<string> UploadToS3(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty");
        }

        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{fileExtension}";
        var key = $"videos/{fileName}";

        using (var stream = file.OpenReadStream())
        {
            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = stream,
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(request);
        }

        return $"https://{_bucketName}.s3.amazonaws.com/{key}";
    }

    public async Task<bool> DeleteVideo(string videoId)
    {
        if (videoId.StartsWith("http"))
        {
            return true;
        }

        try
        {
            var uri = new Uri(videoId);
            var key = uri.AbsolutePath.TrimStart('/');

            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            await _s3Client.DeleteObjectAsync(deleteRequest);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }
}
