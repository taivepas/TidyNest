using TidyNest.Server.Features.HomeData;

namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetSummaryHandler
{
    public static Task<IResult> Handle()
        => Task.FromResult<IResult>(Results.Ok(new DashboardSummaryResponse(7, 3, 2, 64)));
}
