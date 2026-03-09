using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data;
using TidyNest.Server.Features.HomeData;

namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetRecentActivityHandler
{
    public static async Task<IResult> Handle(TidyNestDbContext dbContext, CancellationToken cancellationToken)
    {
        var activities = await dbContext.ActivityItems
            .AsNoTracking()
            .OrderByDescending(a => a.TimestampUtc)
            .Take(20)
            .Select(a => new ActivityItemResponse(
                a.Id,
                a.Type,
                a.TimestampUtc.ToString("O"),
                a.Description,
                a.Actor))
            .ToListAsync(cancellationToken);

        return Results.Ok(activities);
    }
}
