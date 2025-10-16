using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gym_be.Migrations
{
    /// <inheritdoc />
    public partial class ChangeScheduleTimeToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "starttime",
                schema: "public",
                table: "schedule",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "endtime",
                schema: "public",
                table: "schedule",
                type: "character varying(5)",
                maxLength: 5,
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            // migrationBuilder.AddColumn<string>(
            //     name: "gender",
            //     schema: "public",
            //     table: "customer",
            //     type: "character varying(10)",
            //     maxLength: 10,
            //     nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "gender",
                schema: "public",
                table: "customer");

            migrationBuilder.AlterColumn<DateTime>(
                name: "starttime",
                schema: "public",
                table: "schedule",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(5)",
                oldMaxLength: 5);

            migrationBuilder.AlterColumn<DateTime>(
                name: "endtime",
                schema: "public",
                table: "schedule",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(5)",
                oldMaxLength: 5);
        }
    }
}
