import logger from "../config/logger.config.js";
import type {
    CreateHotelDto,
    UpdateHotelDto,
    HotelIdDto,
} from "../dtos/hotel.dto.js";
import {
    createHotel,
    findHotelById,
    findAllHotels,
    updateHotel,
    softDeleteHotel,
    permanentlyDeleteHotel,
} from "../repositories/hotel.repository.js";
import { NotFoundError } from "../utils/errors/app.error.js";

// Creates a new hotel using the validated data provided by the caller.
export async function createHotelService(hotelData: CreateHotelDto) {
    const hotel = await createHotel(hotelData);

    // Records the successful hotel creation.
    logger.info(`Hotel created successfully: ${hotel.id}`);

    return hotel;
}

// Retrieves an active hotel by its validated UUID.
export async function getHotelByIdService(id: HotelIdDto) {
    const hotel = await findHotelById(id);

    // Throws a 404 error when no active hotel matches the requested UUID.
    if (!hotel) {
        logger.warn(`Hotel not found: ${id}`);
        throw new NotFoundError(`Hotel with id ${id} not found`);
    }

    // Records the successful hotel retrieval.
    logger.info(`Hotel retrieved successfully: ${hotel.id}`);

    return hotel;
}

// Retrieves all hotels that have not been soft-deleted.
export async function getAllHotelsService() {
    const hotels = await findAllHotels();

    // Records the number of active hotels retrieved.
    logger.info(`Retrieved ${hotels.length} active hotels`);

    return hotels;
}

// Updates an active hotel using the validated partial update data.
export async function updateHotelService(
    id: HotelIdDto,
    hotelData: UpdateHotelDto,
) {
    const hotel = await updateHotel(id, hotelData);

    // Throws a 404 error when no active hotel matches the requested UUID.
    if (!hotel) {
        logger.warn(`Hotel not found for update: ${id}`);
        throw new NotFoundError(`Hotel with id ${id} not found`);
    }

    // Records the successful hotel update.
    logger.info(`Hotel updated successfully: ${hotel.id}`);

    return hotel;
}

// Soft-deletes an active hotel without permanently removing its record.
export async function deleteHotelService(id: HotelIdDto) {
    const response = await softDeleteHotel(id);

    // Records the successful soft deletion.
    logger.info(`Hotel soft-deleted successfully: ${id}`);

    return response;
}

// Permanently removes a hotel from the database.
export async function permanentlyDeleteHotelService(id: HotelIdDto) {
    const response = await permanentlyDeleteHotel(id);

    // Records the successful permanent deletion.
    logger.info(`Hotel permanently deleted: ${id}`);

    return response;
}