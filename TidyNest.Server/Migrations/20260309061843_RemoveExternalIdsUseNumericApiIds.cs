using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TidyNest.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveExternalIdsUseNumericApiIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "ActivityItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExternalId",
                table: "Tasks",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ExternalId",
                table: "Rooms",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ExternalId",
                table: "ActivityItems",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");
        }
    }
}
