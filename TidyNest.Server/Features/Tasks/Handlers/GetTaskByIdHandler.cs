using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data;

namespace TidyNest.Server.Features.Tasks.Handlers;

public static class GetTaskByIdHandler
{
    public static async Task<IResult> Handle(int id, TidyNestDbContext dbContext, CancellationToken cancellationToken)
    {
        var task = await dbContext.Tasks
            .AsNoTracking()
            .Where(t => t.Id == id)
            .Select(t => new TaskItemResponse(
                t.Id,
                t.Title,
                t.DueAtUtc.ToString("O"),
                t.RoomId,
                t.IsRecurring,
                t.IsCompleted,
                t.CompletedAtUtc == null ? null : t.CompletedAtUtc.Value.ToString("O")))
            .FirstOrDefaultAsync(cancellationToken);

        if (task is null)
        {
            return Results.NotFound(new ErrorResponse("task_not_found", "Task not found."));
        }

        return Results.Ok(task);
    }
}
