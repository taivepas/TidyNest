using TidyNest.Server.Features.Tasks.Handlers;

namespace TidyNest.Server.Features.Tasks;

public static class MapTaskEndpoints
{
    public static IEndpointRouteBuilder MapTasks(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tasks");

        group.MapGet("", GetTasksHandler.Handle);
        group.MapGet("/{id:int}", GetTaskByIdHandler.Handle);
        group.MapPost("", CreateTaskHandler.Handle);
        group.MapPut("/{id:int}", UpdateTaskHandler.Handle);
        group.MapDelete("/{id:int}", DeleteTaskHandler.Handle);

        return app;
    }
}
