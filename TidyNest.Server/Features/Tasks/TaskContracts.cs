namespace TidyNest.Server.Features.Tasks;

public sealed record TaskItemResponse(
    int Id,
    string Title,
    string DueAt,
    int? RoomId,
    bool IsRecurring,
    bool IsCompleted,
    string? CompletedAt);

public sealed record CreateTaskRequest(
    string Title,
    string DueAt,
    int? RoomId,
    bool IsRecurring);

public sealed record UpdateTaskRequest(
    string Title,
    string DueAt,
    int? RoomId,
    bool IsRecurring,
    bool IsCompleted);

public sealed record ErrorResponse(string Code, string Message);
