using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data;

namespace TidyNest.Server.Features.Tasks.Handlers;

public static class UpdateTaskHandler
{
    public static async Task<IResult> Handle(int id, UpdateTaskRequest request, TidyNestDbContext dbContext, CancellationToken cancellationToken)
    {
        var titleError = TaskValidation.ValidateTitle(request.Title);
        if (titleError is not null)
        {
            return TaskValidation.BadRequest("invalid_title", titleError);
        }

        if (!TaskValidation.TryParseDueAt(request.DueAt, out var dueAt))
        {
            return TaskValidation.BadRequest("invalid_due_at", "DueAt must be a valid timestamp.");
        }

        var roomError = await TaskValidation.ValidateRoomAsync(dbContext, request.RoomId, cancellationToken);
        if (roomError is not null)
        {
            return TaskValidation.BadRequest("invalid_room", roomError);
        }

        var taskEntity = await dbContext.Tasks
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        if (taskEntity is null)
        {
            return Results.NotFound(new ErrorResponse("task_not_found", "Task not found."));
        }

        taskEntity.Title = request.Title.Trim();
        taskEntity.DueAtUtc = dueAt.ToUniversalTime();
        taskEntity.RoomId = request.RoomId;
        taskEntity.IsRecurring = request.IsRecurring;
        taskEntity.IsCompleted = request.IsCompleted;
        taskEntity.CompletedAtUtc = request.IsCompleted ? DateTimeOffset.UtcNow : null;

        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new TaskItemResponse(
            taskEntity.Id,
            taskEntity.Title,
            taskEntity.DueAtUtc.ToString("O"),
            taskEntity.RoomId,
            taskEntity.IsRecurring,
            taskEntity.IsCompleted,
            taskEntity.CompletedAtUtc == null ? null : taskEntity.CompletedAtUtc.Value.ToString("O"));

        return Results.Ok(response);
    }
}
