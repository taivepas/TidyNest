using Microsoft.EntityFrameworkCore;
using System.Linq;
using TidyNest.Server.Data.Entities;

namespace TidyNest.Server.Data.Seed;

public static class HomeDataSeeder
{
    public static async Task SeedAsync(TidyNestDbContext dbContext, ILogger logger, CancellationToken cancellationToken = default)
    {
        // Idempotency guard: if we already have rooms, assume seed ran.
        if (await dbContext.Rooms.AnyAsync(cancellationToken))
        {
            return;
        }

		logger.LogInformation("Seeding initial home data to LocalDB instance.");
		
		var rooms = new List<RoomEntity>
		{
			new()
			{
				Name = "Kitchen",
				Status = "needs_tidy",
				LastCleanedAtUtc = DateTimeOffset.Parse("2026-03-05T18:30:00Z"),
            },
			new()
			{
				Name = "Living Room",
				Status = "clean",
                LastCleanedAtUtc = DateTimeOffset.Parse("2026-03-06T09:15:00Z"),
            },
			new()
			{
				Name = "Bathroom",
				Status = "deep_clean",
                LastCleanedAtUtc = DateTimeOffset.Parse("2026-03-04T20:45:00Z"),
            },
        };

		dbContext.Rooms.AddRange(rooms);

		await dbContext.SaveChangesAsync(cancellationToken);

		var tasks = new List<HouseTaskEntity>
		{
			new()
			{
				Title = "Vacuum living room",
				DueAtUtc = DateTimeOffset.Parse("2026-03-07T17:00:00Z"),
				RoomId = rooms.Single(r => r.Name == "Living Room").Id,
				IsRecurring = true,
				IsCompleted = false,
			},
			new()
			{
				Title = "Clean kitchen counters",
				DueAtUtc = DateTimeOffset.Parse("2026-03-07T19:30:00Z"),
				RoomId = rooms.Single(r => r.Name == "Kitchen").Id,
				IsRecurring = false,
				IsCompleted = false,
			},
			new()
			{
				Title = "Bathroom deep clean",
				DueAtUtc = DateTimeOffset.Parse("2026-03-08T10:00:00Z"),
				RoomId = rooms.Single(r => r.Name == "Bathroom").Id,
				IsRecurring = true,
				IsCompleted = false,
			},
		};

		dbContext.Tasks.AddRange(tasks);

		var activities = new List<ActivityEntity>
		{
			new()
			{
				Type = "task_completed",
				TimestampUtc = DateTimeOffset.Parse("2026-03-07T08:15:00Z"),
				Description = "Dishes were done",
				Actor = "Alex",
			},
			new()
			{
				Type = "task_completed",
				TimestampUtc = DateTimeOffset.Parse("2026-03-06T21:05:00Z"),
				Description = "Laundry folded",
				Actor = "Jamie",
			},
			new()
			{
				Type = "task_added",
				TimestampUtc = DateTimeOffset.Parse("2026-03-06T19:45:00Z"),
				Description = "Added weekly plant watering",
				Actor = "Alex",
			},
		};

        dbContext.ActivityItems.AddRange(activities);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Initial home data seeding completed.");
    }
}
