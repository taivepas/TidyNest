using TidyNest.Server.Features.HomeData;

namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetUpcomingTasksHandler
{
    public static Task<IResult> Handle()
        => Task.FromResult<IResult>(Results.Ok(new[]
        {
            new UpcomingTaskResponse("task-1", "Vacuum living room", "2026-03-07T17:00:00Z", "living-room", true),
            new UpcomingTaskResponse("task-2", "Clean kitchen counters", "2026-03-07T19:30:00Z", "kitchen", false),
            new UpcomingTaskResponse("task-3", "Bathroom deep clean", "2026-03-08T10:00:00Z", "bathroom", true),
        }));
}
