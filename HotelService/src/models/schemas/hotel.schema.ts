import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    real,
    integer,
    text,
} from "drizzle-orm/pg-core";

export const hotels = pgTable("hotels", {
    // Uniquely identifies each hotel and automatically generates its UUID.
    id: uuid("id").defaultRandom().primaryKey(),

    // Stores the hotel's name, limited to 100 characters.
    name: varchar("name", { length: 100 }).notNull(),

    // Stores the hotel's complete address.
    address: text("address").notNull(),

    // Stores the hotel's city, region, or general location.
    location: varchar("location", { length: 100 }).notNull(),

    // Records when the hotel was created; PostgreSQL supplies the current timestamp when the value is omitted during insertion.
    createdAt: timestamp("created_at").defaultNow().notNull(),

    // Records the last update time; defaultNow() sets the initial value only, so updates must refresh it manually or use a database trigger.
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // Records when the hotel was soft-deleted; NULL means the hotel has not been deleted.
    deletedAt: timestamp("deleted_at"),

    // Stores the hotel's average rating, defaulting to 0 when omitted; explicitly passing NULL causes a database error because of notNull().
    rating: real("rating").default(0).notNull(),

    // Stores the total number of ratings, defaulting to 0 when omitted; explicitly passing NULL causes a database error because of notNull().
    ratingCount: integer("rating_count").default(0).notNull(),
});