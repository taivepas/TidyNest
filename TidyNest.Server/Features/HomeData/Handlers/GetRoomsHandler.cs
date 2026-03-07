using TidyNest.Server.Features.HomeData;

namespace TidyNest.Server.Features.HomeData.Handlers;

public static class GetRoomsHandler
{
    public static Task<IResult> Handle()
        => Task.FromResult<IResult>(Results.Ok(new[]
        {
            new RoomStatusResponse("kitchen", "Kitchen", "needs_tidy", "2026-03-05T18:30:00Z"),
            new RoomStatusResponse("living-room", "Living Room", "clean", "2026-03-06T09:15:00Z"),
            new RoomStatusResponse("bathroom", "Bathroom", "deep_clean", "2026-03-04T20:45:00Z"),
        }));
}
