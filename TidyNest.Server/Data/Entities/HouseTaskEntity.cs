namespace TidyNest.Server.Data.Entities;

public sealed class HouseTaskEntity
{
	// Surrogate primary key used by EF and exposed via API
	public int Id { get; set; }

    public string Title { get; set; } = default!;

	public DateTimeOffset DueAtUtc { get; set; }

	public int? RoomId { get; set; }

    public RoomEntity? Room { get; set; }

    public bool IsRecurring { get; set; }

    public bool IsCompleted { get; set; }

    public DateTimeOffset? CompletedAtUtc { get; set; }
}
