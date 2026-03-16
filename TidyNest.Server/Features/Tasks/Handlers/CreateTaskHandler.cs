using TidyNest.Server.Data;
using TidyNest.Server.Data.Entities;

namespace TidyNest.Server.Features.Tasks.Handlers;

public static class CreateTaskHandler
{
    public static async Task<IResult> Handle(CreateTaskRequest request, TidyNestDbContext dbContext, CancellationToken cancellationToken)
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

        var entity = new HouseTaskEntity
        {
            Title = request.Title.Trim(),
            DueAtUtc = dueAt.ToUniversalTime(),
            RoomId = request.RoomId,
            IsRecurring = request.IsRecurring,
            IsCompleted = false,
            CompletedAtUtc = null,
        };

        dbContext.Tasks.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new TaskItemResponse(
            entity.Id,
            entity.Title,
            entity.DueAtUtc.ToString("O"),
            entity.RoomId,
            entity.IsRecurring,
            entity.IsCompleted,
            null);

        return Results.Created($"/api/tasks/{entity.Id}", response);
    }
}
