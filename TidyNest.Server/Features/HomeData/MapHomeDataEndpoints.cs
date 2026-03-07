using TidyNest.Server.Features.HomeData.Handlers;

namespace TidyNest.Server.Features.HomeData;

public static class MapHomeDataEndpoints
{
    public static IEndpointRouteBuilder MapHomeData(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("/summary", GetSummaryHandler.Handle);
        group.MapGet("/rooms", GetRoomsHandler.Handle);
        group.MapGet("/tasks/upcoming", GetUpcomingTasksHandler.Handle);
        group.MapGet("/activity/recent", GetRecentActivityHandler.Handle);

        return app;
    }
}
