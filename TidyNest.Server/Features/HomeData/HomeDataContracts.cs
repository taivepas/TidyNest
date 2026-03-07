namespace TidyNest.Server.Features.HomeData;

public sealed record DashboardSummaryResponse(
    int TodayTasksTotal,
    int TodayTasksCompleted,
    int RoomsNeedingAttention,
    int WeeklyProgressPercent);

public sealed record RoomStatusResponse(
    string Id,
    string Name,
    string Status,
    string LastCleanedAt);

public sealed record UpcomingTaskResponse(
    string Id,
    string Title,
    string DueAt,
    string? RoomId,
    bool IsRecurring);

public sealed record ActivityItemResponse(
    string Id,
    string Type,
    string Timestamp,
    string Description,
    string Actor);
