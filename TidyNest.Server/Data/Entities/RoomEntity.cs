using System.Collections.Generic;

namespace TidyNest.Server.Data.Entities;

public sealed class RoomEntity
{
	// Surrogate primary key used by EF and exposed via API
	public int Id { get; set; }

	public string Name { get; set; } = default!;

	public string Status { get; set; } = default!;

	public DateTimeOffset LastCleanedAtUtc { get; set; }

	public ICollection<HouseTaskEntity> Tasks { get; set; } = new List<HouseTaskEntity>();
}
