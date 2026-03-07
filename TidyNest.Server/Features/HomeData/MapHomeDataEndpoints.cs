namespace TidyNest.Server.Features.HomeData;

public static class MapHomeDataEndpoints
{
    public static IEndpointRouteBuilder MapHomeData(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("/summary", () => Results.Ok(new DashboardSummaryResponse(7, 3, 2, 64)));

        group.MapGet("/rooms", () => Results.Ok(new[]
        {
            new RoomStatusResponse("kitchen", "Kitchen", "needs_tidy", "2026-03-05T18:30:00Z"),
            new RoomStatusResponse("living-room", "Living Room", "clean", "2026-03-06T09:15:00Z"),
            new RoomStatusResponse("bathroom", "Bathroom", "deep_clean", "2026-03-04T20:45:00Z"),
        }));

        group.MapGet("/tasks/upcoming", () => Results.Ok(new[]
        {
            new UpcomingTaskResponse("task-1", "Vacuum living room", "2026-03-07T17:00:00Z", "living-room", true),
            new UpcomingTaskResponse("task-2", "Clean kitchen counters", "2026-03-07T19:30:00Z", "kitchen", false),
            new UpcomingTaskResponse("task-3", "Bathroom deep clean", "2026-03-08T10:00:00Z", "bathroom", true),
        }));

        group.MapGet("/activity/recent", () => Results.Ok(new[]
        {
            new ActivityItemResponse("activity-1", "task_completed", "2026-03-07T08:15:00Z", "Dishes were done", "Alex"),
            new ActivityItemResponse("activity-2", "task_completed", "2026-03-06T21:05:00Z", "Laundry folded", "Jamie"),
            new ActivityItemResponse("activity-3", "task_added", "2026-03-06T19:45:00Z", "Added weekly plant watering", "Alex"),
        }));

        return app;
    }
}
