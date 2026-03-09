namespace TidyNest.Server.Data.Entities;

public sealed class ActivityEntity
{
    public string Id { get; set; } = default!;

    public string Type { get; set; } = default!;

    public DateTimeOffset TimestampUtc { get; set; }

    public string Description { get; set; } = default!;

    public string Actor { get; set; } = default!;
}
