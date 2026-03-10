using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data;
using TidyNest.Server.Features.HomeData;

namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetSummaryHandler
{
    public static async Task<IResult> Handle(TidyNestDbContext dbContext, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;

        var todayTasksTotal = await dbContext.Tasks
            .CountAsync(t => t.DueAtUtc.Date == today, cancellationToken);

        var todayTasksCompleted = await dbContext.Tasks
            .CountAsync(t => t.DueAtUtc.Date == today && t.IsCompleted, cancellationToken);

        var roomsNeedingAttention = await dbContext.Rooms
            .CountAsync(r => r.Status != "clean", cancellationToken);

        var weekStart = today.AddDays(-6);

        var weeklyTasksQuery = dbContext.Tasks
            .Where(t => t.DueAtUtc.Date >= weekStart && t.DueAtUtc.Date <= today);

        var weeklyTasksTotal = await weeklyTasksQuery.CountAsync(cancellationToken);
        var weeklyTasksCompleted = await weeklyTasksQuery
            .CountAsync(t => t.IsCompleted, cancellationToken);

        var weeklyProgressPercent = weeklyTasksTotal == 0
            ? 0
            : (int)Math.Round(100.0 * weeklyTasksCompleted / weeklyTasksTotal);

        var response = new DashboardSummaryResponse(
            todayTasksTotal,
            todayTasksCompleted,
            roomsNeedingAttention,
            weeklyProgressPercent);

        return Results.Ok(response);
    }
}
