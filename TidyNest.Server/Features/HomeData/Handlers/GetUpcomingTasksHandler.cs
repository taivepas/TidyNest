using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data;
using TidyNest.Server.Features.HomeData;

namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetUpcomingTasksHandler
{
    public static async Task<IResult> Handle(TidyNestDbContext dbContext, CancellationToken cancellationToken)
    {
		var tasks = await dbContext.Tasks
			.AsNoTracking()
			.OrderBy(t => t.DueAtUtc)
			.Select(t => new UpcomingTaskResponse(
				t.Id,
				t.Title,
				t.DueAtUtc.ToString("O"),
				t.RoomId,
				t.IsRecurring))
            .ToListAsync(cancellationToken);

        return Results.Ok(tasks);
    }
}
