using System.Collections.Generic;

namespace TidyNest.Server.Data.Entities;

public sealed class RoomEntity
{
    public string Id { get; set; } = default!;

    public string Name { get; set; } = default!;

    public string Status { get; set; } = default!;

    public DateTimeOffset LastCleanedAtUtc { get; set; }

    public ICollection<HouseTaskEntity> Tasks { get; set; } = new List<HouseTaskEntity>();
}
