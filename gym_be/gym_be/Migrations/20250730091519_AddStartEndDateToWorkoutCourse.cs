using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gym_be.Migrations
{
    /// <inheritdoc />
    public partial class AddStartEndDateToWorkoutCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "enddate",
                schema: "public",
                table: "workoutcourse",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "startdate",
                schema: "public",
                table: "workoutcourse",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "enddate",
                schema: "public",
                table: "workoutcourse");

            migrationBuilder.DropColumn(
                name: "startdate",
                schema: "public",
                table: "workoutcourse");
        }
    }
}
