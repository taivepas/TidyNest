using Microsoft.EntityFrameworkCore;
using TidyNest.Server.Data.Entities;

namespace TidyNest.Server.Data;

public sealed class TidyNestDbContext(DbContextOptions<TidyNestDbContext> options) : DbContext(options)
{
    public DbSet<RoomEntity> Rooms => Set<RoomEntity>();

    public DbSet<HouseTaskEntity> Tasks => Set<HouseTaskEntity>();

    public DbSet<ActivityEntity> ActivityItems => Set<ActivityEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Marker comment to verify this file participates in compilation.
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RoomEntity>(builder =>
        {
            builder.HasKey(r => r.Id);
            builder.Property(r => r.Id).IsRequired().HasMaxLength(64);
            builder.Property(r => r.Name).IsRequired().HasMaxLength(200);
            builder.Property(r => r.Status).IsRequired().HasMaxLength(64);
        });

        modelBuilder.Entity<HouseTaskEntity>(builder =>
        {
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Id).IsRequired().HasMaxLength(64);
            builder.Property(t => t.Title).IsRequired().HasMaxLength(500);

            builder.HasOne(t => t.Room)
                .WithMany(r => r.Tasks)
                .HasForeignKey(t => t.RoomId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ActivityEntity>(builder =>
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).IsRequired().HasMaxLength(64);
            builder.Property(a => a.Type).IsRequired().HasMaxLength(64);
            builder.Property(a => a.Description).IsRequired().HasMaxLength(1000);
            builder.Property(a => a.Actor).IsRequired().HasMaxLength(200);
        });
    }
}
