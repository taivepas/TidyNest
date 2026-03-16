using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data;

namespace TidyNest.Server.Features.Tasks;

internal static class TaskValidation
{
    public static string? ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return "Title is required.";
        }

        if (title.Trim().Length > 500)
        {
            return "Title must be 500 characters or fewer.";
        }

        return null;
    }

    public static bool TryParseDueAt(string dueAt, out DateTimeOffset parsedDueAt)
    {
        return DateTimeOffset.TryParse(dueAt, out parsedDueAt);
    }

    public static async Task<string?> ValidateRoomAsync(TidyNestDbContext dbContext, int? roomId, CancellationToken cancellationToken)
    {
        if (roomId is null)
        {
            return null;
        }

        var exists = await dbContext.Rooms.AnyAsync(r => r.Id == roomId.Value, cancellationToken);
        if (!exists)
        {
            return "Room not found.";
        }

        return null;
    }

    public static IResult BadRequest(string code, string message)
    {
        return Results.BadRequest(new ErrorResponse(code, message));
    }
}
