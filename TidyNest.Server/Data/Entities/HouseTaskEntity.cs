namespace TidyNest.Server.Data.Entities;

public sealed class HouseTaskEntity
{
    public string Id { get; set; } = default!;

    public string Title { get; set; } = default!;

    public DateTimeOffset DueAtUtc { get; set; }

    public string? RoomId { get; set; }

    public RoomEntity? Room { get; set; }

    public bool IsRecurring { get; set; }

    public bool IsCompleted { get; set; }

    public DateTimeOffset? CompletedAtUtc { get; set; }
}
