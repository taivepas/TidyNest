using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data;

namespace TidyNest.Server.Features.Tasks.Handlers;

public static class DeleteTaskHandler
{
    public static async Task<IResult> Handle(int id, TidyNestDbContext dbContext, CancellationToken cancellationToken)
    {
        var taskEntity = await dbContext.Tasks
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (taskEntity is null)
        {
            return Results.NotFound(new ErrorResponse("task_not_found", "Task not found."));
        }

        dbContext.Tasks.Remove(taskEntity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Results.NoContent();
    }
}
