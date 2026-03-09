using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data;
using TidyNest.Server.Features.HomeData;

namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetRoomsHandler
{
    public static async Task<IResult> Handle(TidyNestDbContext dbContext, CancellationToken cancellationToken)
    {
        var rooms = await dbContext.Rooms
            .AsNoTracking()
            .OrderBy(r => r.Name)
            .Select(r => new RoomStatusResponse(
                r.Id,
                r.Name,
                r.Status,
                r.LastCleanedAtUtc.ToString("O")))
            .ToListAsync(cancellationToken);

        return Results.Ok(rooms);
    }
}
