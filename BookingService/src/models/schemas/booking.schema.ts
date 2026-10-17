import {
    pgTable,
    pgEnum,
    uuid,
    timestamp,
    boolean,
    integer,
    check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Defines the valid lifecycle states for a booking.
export const bookingStatusEnum = pgEnum("booking_status", [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
]);

// Stores booking details and enforces valid amounts and guest counts.
export const bookings = pgTable(
    "bookings",
    {
        // Generates a unique UUID for each booking.
        id: uuid("id").defaultRandom().primaryKey(),

        // Identifies the user who made the booking.
        userId: uuid("user_id").notNull(),

        // Identifies the hotel associated with the booking.
        hotelId: uuid("hotel_id").notNull(),

        // Records when the booking was created.
        createdAt: timestamp("created_at").defaultNow().notNull(),

        // Records the last update time; refresh it explicitly on updates.
        updatedAt: timestamp("updated_at").defaultNow().notNull(),

        // Stores the booking amount, which must be greater than zero.
        bookingAmount: integer("booking_amount").notNull(),

        // Tracks the booking lifecycle and defaults new bookings to PENDING.
        status: bookingStatusEnum("status").default("PENDING").notNull(),

        // Stores the number of guests, which cannot be negative.
        totalGuests: integer("total_guests").notNull(),
    },
    (table) => [
        // Prevents zero or negative booking amounts at the database level.
        check("booking_amount_positive", sql`${table.bookingAmount} > 0`),

        // Prevents negative guest counts at the database level.
        check("total_guests_nonnegative", sql`${table.totalGuests} >= 0`),
    ],
);

// Stores idempotency keys to prevent duplicate booking operations.
export const idempotencyKeys = pgTable("idempotency_keys", {
    // Generates a unique UUID for each idempotency record.
    id: uuid("id").defaultRandom().primaryKey(),

    // Stores a UUID that uniquely identifies an idempotent request.
    idemKey: uuid("idem_key").notNull().unique(),

    // Records when the idempotency record was created.
    createdAt: timestamp("created_at").defaultNow().notNull(),

    // Records the last update time; refresh it explicitly on updates.
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // Indicates whether the associated operation has been finalized.
    finalized: boolean("finalized").default(false).notNull(),

    // Links one idempotency record to a single booking.
    bookingId: uuid("booking_id")
        .notNull()
        .unique()
        .references(() => bookings.id),
});
