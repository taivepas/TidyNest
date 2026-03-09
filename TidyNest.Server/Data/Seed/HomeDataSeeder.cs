using Microsoft.EntityFrameworkCore;
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
                Id = "kitchen",
                Name = "Kitchen",
                Status = "needs_tidy",
                LastCleanedAtUtc = DateTimeOffset.Parse("2026-03-05T18:30:00Z"),
            },
            new()
            {
                Id = "living-room",
                Name = "Living Room",
                Status = "clean",
                LastCleanedAtUtc = DateTimeOffset.Parse("2026-03-06T09:15:00Z"),
            },
            new()
            {
                Id = "bathroom",
                Name = "Bathroom",
                Status = "deep_clean",
                LastCleanedAtUtc = DateTimeOffset.Parse("2026-03-04T20:45:00Z"),
            },
        };

        dbContext.Rooms.AddRange(rooms);

        var tasks = new List<HouseTaskEntity>
        {
            new()
            {
                Id = "task-1",
                Title = "Vacuum living room",
                DueAtUtc = DateTimeOffset.Parse("2026-03-07T17:00:00Z"),
                RoomId = "living-room",
                IsRecurring = true,
                IsCompleted = false,
            },
            new()
            {
                Id = "task-2",
                Title = "Clean kitchen counters",
                DueAtUtc = DateTimeOffset.Parse("2026-03-07T19:30:00Z"),
                RoomId = "kitchen",
                IsRecurring = false,
                IsCompleted = false,
            },
            new()
            {
                Id = "task-3",
                Title = "Bathroom deep clean",
                DueAtUtc = DateTimeOffset.Parse("2026-03-08T10:00:00Z"),
                RoomId = "bathroom",
                IsRecurring = true,
                IsCompleted = false,
            },
        };

        dbContext.Tasks.AddRange(tasks);

        var activities = new List<ActivityEntity>
        {
            new()
            {
                Id = "activity-1",
                Type = "task_completed",
                TimestampUtc = DateTimeOffset.Parse("2026-03-07T08:15:00Z"),
                Description = "Dishes were done",
                Actor = "Alex",
            },
            new()
            {
                Id = "activity-2",
                Type = "task_completed",
                TimestampUtc = DateTimeOffset.Parse("2026-03-06T21:05:00Z"),
                Description = "Laundry folded",
                Actor = "Jamie",
            },
            new()
            {
                Id = "activity-3",
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
