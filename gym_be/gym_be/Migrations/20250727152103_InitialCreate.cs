using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gym_be.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "customer",
                schema: "public",
                columns: table => new
                {
                    customerid = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    phonenumber = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    address = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    height = table.Column<float>(type: "real", nullable: true),
                    weight = table.Column<float>(type: "real", nullable: true),
                    email = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    password = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    type = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_customer", x => x.customerid);
                });

            migrationBuilder.CreateTable(
                name: "payment",
                schema: "public",
                columns: table => new
                {
                    paymentid = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    method = table.Column<bool>(type: "boolean", nullable: true),
                    status = table.Column<bool>(type: "boolean", nullable: true),
                    paidat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    customerid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payment", x => x.paymentid);
                });

            migrationBuilder.CreateTable(
                name: "payment_detail",
                schema: "public",
                columns: table => new
                {
                    payment_detail_id = table.Column<Guid>(type: "uuid", nullable: false),
                    paymentid = table.Column<Guid>(type: "uuid", nullable: false),
                    courseid = table.Column<Guid>(type: "uuid", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    customerid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payment_detail", x => x.payment_detail_id);
                });

            migrationBuilder.CreateTable(
                name: "schedule",
                schema: "public",
                columns: table => new
                {
                    scheduleid = table.Column<Guid>(type: "uuid", nullable: false),
                    dayofweek = table.Column<string>(type: "text", nullable: false),
                    maxparticipants = table.Column<int>(type: "integer", nullable: false),
                    starttime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    endtime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_schedule", x => x.scheduleid);
                });

            migrationBuilder.CreateTable(
                name: "service",
                schema: "public",
                columns: table => new
                {
                    serviceid = table.Column<Guid>(type: "uuid", nullable: false),
                    servicename = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    coursedescription = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    serviceprice = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service", x => x.serviceid);
                });

            migrationBuilder.CreateTable(
                name: "status",
                schema: "public",
                columns: table => new
                {
                    statusid = table.Column<Guid>(type: "uuid", nullable: false),
                    statusname = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_status", x => x.statusid);
                });

            migrationBuilder.CreateTable(
                name: "workoutcourse",
                schema: "public",
                columns: table => new
                {
                    courseid = table.Column<Guid>(type: "uuid", nullable: false),
                    coursename = table.Column<string>(type: "text", nullable: false),
                    imageurl = table.Column<string>(type: "text", nullable: false),
                    personaltrainer = table.Column<Guid>(type: "uuid", nullable: false),
                    durationweek = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    schedules = table.Column<List<Guid>>(type: "jsonb", nullable: false),
                    serviceid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workoutcourse", x => x.courseid);
                    table.ForeignKey(
                        name: "FK_workoutcourse_customer_personaltrainer",
                        column: x => x.personaltrainer,
                        principalSchema: "public",
                        principalTable: "customer",
                        principalColumn: "customerid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "appointment",
                schema: "public",
                columns: table => new
                {
                    appointmentid = table.Column<Guid>(type: "uuid", nullable: false),
                    appointmentname = table.Column<string>(type: "text", nullable: false),
                    appointmentdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    appointmenttime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    customerid = table.Column<Guid>(type: "uuid", nullable: false),
                    serviceid = table.Column<Guid>(type: "uuid", nullable: false),
                    statusid = table.Column<Guid>(type: "uuid", nullable: false),
                    scheduleid = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointment", x => x.appointmentid);
                    table.ForeignKey(
                        name: "FK_appointment_customer_customerid",
                        column: x => x.customerid,
                        principalSchema: "public",
                        principalTable: "customer",
                        principalColumn: "customerid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "scheduleid",
                        column: x => x.scheduleid,
                        principalSchema: "public",
                        principalTable: "schedule",
                        principalColumn: "scheduleid");
                    table.ForeignKey(
                        name: "FK_appointment_service_serviceid",
                        column: x => x.serviceid,
                        principalSchema: "public",
                        principalTable: "service",
                        principalColumn: "serviceid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointment_customerid",
                schema: "public",
                table: "appointment",
                column: "customerid");

            migrationBuilder.CreateIndex(
                name: "IX_appointment_scheduleid",
                schema: "public",
                table: "appointment",
                column: "scheduleid");

            migrationBuilder.CreateIndex(
                name: "IX_appointment_serviceid",
                schema: "public",
                table: "appointment",
                column: "serviceid");

            migrationBuilder.CreateIndex(
                name: "IX_workoutcourse_personaltrainer",
                schema: "public",
                table: "workoutcourse",
                column: "personaltrainer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "appointment",
                schema: "public");

            migrationBuilder.DropTable(
                name: "payment",
                schema: "public");

            migrationBuilder.DropTable(
                name: "payment_detail",
                schema: "public");

            migrationBuilder.DropTable(
                name: "status",
                schema: "public");

            migrationBuilder.DropTable(
                name: "workoutcourse",
                schema: "public");

            migrationBuilder.DropTable(
                name: "schedule",
                schema: "public");

            migrationBuilder.DropTable(
                name: "service",
                schema: "public");

            migrationBuilder.DropTable(
                name: "customer",
                schema: "public");
        }
    }
}
