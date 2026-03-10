namespace TidyNest.Server.Data.Entities;

public sealed class ActivityEntity
{
	// Surrogate primary key used by EF and exposed via API
	public int Id { get; set; }

	public string Type { get; set; } = default!;

    public DateTimeOffset TimestampUtc { get; set; }

    public string Description { get; set; } = default!;

    public string Actor { get; set; } = default!;
}
