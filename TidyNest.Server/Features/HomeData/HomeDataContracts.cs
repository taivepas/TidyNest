namespace TidyNest.Server.Features.HomeData;

public sealed record DashboardSummaryResponse(
    int TodayTasksTotal,
    int TodayTasksCompleted,
    int RoomsNeedingAttention,
    int WeeklyProgressPercent);

public sealed record RoomStatusResponse(
	int Id,
	string Name,
	string Status,
	string LastCleanedAt);

public sealed record UpcomingTaskResponse(
	int Id,
	string Title,
	string DueAt,
	int? RoomId,
	bool IsRecurring);

public sealed record ActivityItemResponse(
	int Id,
	string Type,
    string Timestamp,
    string Description,
    string Actor);
