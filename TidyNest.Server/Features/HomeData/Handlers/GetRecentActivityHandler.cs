using TidyNest.Server.Features.HomeData;

namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetRecentActivityHandler
{
    public static Task<IResult> Handle()
        => Task.FromResult<IResult>(Results.Ok(new[]
        {
            new ActivityItemResponse("activity-1", "task_completed", "2026-03-07T08:15:00Z", "Dishes were done", "Alex"),
            new ActivityItemResponse("activity-2", "task_completed", "2026-03-06T21:05:00Z", "Laundry folded", "Jamie"),
            new ActivityItemResponse("activity-3", "task_added", "2026-03-06T19:45:00Z", "Added weekly plant watering", "Alex"),
        }));
}
