import logger from "../config/logger.config.js";
import db from "../models/index.js";

import { eq, isNull, and } from "drizzle-orm";
import { hotels } from "../models/schemas/hotel.schema.js";
import { NotFoundError } from "../utils/errors/app.error.js";
import type {
    CreateHotelDto,
    UpdateHotelDto,
    HotelIdDto,
} from "../dtos/hotel.dto.js";

// Finds an active hotel by its UUID and returns null if it does not exist.
export async function findHotelById(id: HotelIdDto) {
    const [hotel] = await db
        .select()
        .from(hotels)
        .where(and(eq(hotels.id, id), isNull(hotels.deletedAt)))
        .limit(1);

    return hotel ?? null;
}

// Fetches all hotels that have not been soft-deleted.
export async function findAllHotels() {
    const result = await db
        .select()
        .from(hotels)
        .where(isNull(hotels.deletedAt));

    // Records how many active hotels were retrieved.
    logger.info(`Hotels found: ${result.length}`);

    return result;
}

// Creates a hotel and returns the newly inserted database record.
export async function createHotel(data: CreateHotelDto) {
    const [hotel] = await db.insert(hotels).values(data).returning();

    // Records the UUID of the newly created hotel.
    logger.info(`Hotel created: ${hotel.id}`);

    return hotel;
}

// Updates an active hotel and returns null if no matching hotel exists.
export async function updateHotel(id: HotelIdDto, data: UpdateHotelDto) {
    // Saves the supplied changes and refreshes the last-updated timestamp.
    const [hotel] = await db
        .update(hotels)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(and(eq(hotels.id, id), isNull(hotels.deletedAt)))
        .returning();

    // Records the successful update.
    if (hotel) {
        logger.info(`Hotel updated: ${hotel.id}`);
    }

    return hotel ?? null;
}

// Soft-deletes a hotel by recording when it was deleted.
export async function softDeleteHotel(id: HotelIdDto){
    // Updates only the requested hotel if it has not already been deleted.
    const [hotel] = await db
        .update(hotels)
        .set({
            deletedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(and(eq(hotels.id, id), isNull(hotels.deletedAt)))
        .returning({ id: hotels.id });

    // Throws a 404 error when the hotel does not exist or is already deleted.
    if (!hotel) {
        logger.error(`Hotel not found or already deleted: ${id}`);
        throw new NotFoundError(`Hotel with id ${id} not found`);
    }

    // Records which hotel was successfully soft-deleted.
    logger.info(`Hotel soft deleted: ${hotel.id}`);

    return true;
}

// Permanently removes a hotel from the database when hard deletion is required.
export async function permanentlyDeleteHotel(id: HotelIdDto) {
    // Deletes the requested hotel and returns its UUID if the record existed.
    const [hotel] = await db
        .delete(hotels)
        .where(eq(hotels.id, id))
        .returning({ id: hotels.id });

    // Throws a 404 error when the requested hotel does not exist.
    if (!hotel) {
        logger.error(`Hotel not found for permanent deletion: ${id}`);
        throw new NotFoundError(`Hotel with id ${id} not found`);
    }

    // Records which hotel was permanently removed.
    logger.info(`Hotel permanently deleted: ${hotel.id}`);

    return true;
}
