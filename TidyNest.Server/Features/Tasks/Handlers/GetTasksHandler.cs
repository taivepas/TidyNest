using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data;

namespace TidyNest.Server.Features.Tasks.Handlers;

public static class GetTasksHandler
{
    public static async Task<IResult> Handle(TidyNestDbContext dbContext, CancellationToken cancellationToken)
    {
        var tasks = await dbContext.Tasks
            .AsNoTracking()
            .OrderBy(t => t.DueAtUtc)
            .ThenBy(t => t.Id)
            .Select(t => new TaskItemResponse(
                t.Id,
                t.Title,
                t.DueAtUtc.ToString("O"),
                t.RoomId,
                t.IsRecurring,
                t.IsCompleted,
                t.CompletedAtUtc == null ? null : t.CompletedAtUtc.Value.ToString("O")))
            .ToListAsync(cancellationToken);

        return Results.Ok(tasks);
    }
}
