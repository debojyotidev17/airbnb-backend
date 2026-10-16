import type { Request, Response } from "express";
import type {
    CreateHotelDto,
    UpdateHotelDto,
    HotelIdDto,
} from "../dtos/hotel.dto.js";
import logger from "../config/logger.config.js";
import {
    createHotelService,
    getHotelByIdService,
    getAllHotelsService,
    updateHotelService,
    deleteHotelService,
    permanentlyDeleteHotelService,
} from "../services/hotel.service.js";

// Creates a hotel using the validated request data.
export async function createHotelHandler(req: Request, res: Response) {
    const hotelResponse = await createHotelService(
        req.body as CreateHotelDto,
    );

    logger.info(`Hotel created successfully: ${hotelResponse.id}`);

    return res.status(201).json({
        success: true,
        message: "Hotel created successfully",
        data: hotelResponse,
    });
}

// Retrieves an active hotel using its validated UUID.
export async function getHotelByIdHandler(req: Request, res: Response) {
    const hotelResponse = await getHotelByIdService(
        req.params.id as HotelIdDto,
    );

    logger.info(`Hotel retrieved successfully: ${hotelResponse.id}`);

    return res.status(200).json({
        success: true,
        message: "Hotel retrieved successfully",
        data: hotelResponse,
    });
}

// Returns all hotels that have not been soft-deleted.
export async function getAllHotelsHandler(_req: Request, res: Response) {
    const hotelsResponse = await getAllHotelsService();

    logger.info(`Retrieved ${hotelsResponse.length} active hotels`);

    return res.status(200).json({
        success: true,
        message: "Hotels retrieved successfully",
        data: hotelsResponse,
    });
}

// Updates an active hotel using the validated partial request data.
export async function updateHotelHandler(req: Request, res: Response) {
    const hotelResponse = await updateHotelService(
        req.params.id as HotelIdDto,
        req.body as UpdateHotelDto,
    );

    logger.info(`Hotel updated successfully: ${hotelResponse.id}`);

    return res.status(200).json({
        success: true,
        message: "Hotel updated successfully",
        data: hotelResponse,
    });
}

// Soft-deletes a hotel while keeping its database record.
export async function deleteHotelHandler(req: Request, res: Response) {
    const deleteResponse = await deleteHotelService(
        req.params.id as HotelIdDto,
    );

    logger.info(`Hotel soft-deleted successfully: ${req.params.id}`);

    return res.status(200).json({
        success: true,
        message: "Hotel deleted successfully",
        data: deleteResponse,
    });
}

// Permanently removes a hotel from the database.
export async function permanentlyDeleteHotelHandler(
    req: Request,
    res: Response,
) {
    const deleteResponse = await permanentlyDeleteHotelService(
        req.params.id as HotelIdDto,
    );

    logger.info(`Hotel permanently deleted: ${req.params.id}`);

    return res.status(200).json({
        success: true,
        message: "Hotel permanently deleted successfully",
        data: deleteResponse,
    });
}