import express from "express";

import {
    createHotelSchema,
    updateHotelSchema,
    hotelIdSchema,
} from "../validators/hotel.validator.js";

import {
    validateRequestBody,
    validateRequestParams,
} from "../validators/index.js";

import {
    createHotelHandler,
    getHotelByIdHandler,
    getAllHotelsHandler,
    updateHotelHandler,
    deleteHotelHandler,
    permanentlyDeleteHotelHandler,
} from "../controllers/hotel.controller.js";

const hotelRouter = express.Router();

// Returns all active hotels.
hotelRouter.get("/", getAllHotelsHandler);

// Creates a hotel after validating the request body.
hotelRouter.post(
    "/",
    validateRequestBody(createHotelSchema),
    createHotelHandler,
);

// Retrieves an active hotel after validating its UUID.
hotelRouter.get(
    "/:id",
    validateRequestParams(hotelIdSchema),
    getHotelByIdHandler,
);

// Updates an active hotel after validating its UUID and partial data.
hotelRouter.patch(
    "/:id",
    validateRequestParams(hotelIdSchema),
    validateRequestBody(updateHotelSchema),
    updateHotelHandler,
);

// Soft-deletes a hotel after validating its UUID.
hotelRouter.delete(
    "/:id",
    validateRequestParams(hotelIdSchema),
    deleteHotelHandler,
);

// Permanently removes a hotel after validating its UUID.
hotelRouter.delete(
    "/:id/permanent",
    validateRequestParams(hotelIdSchema),
    permanentlyDeleteHotelHandler,
);

export default hotelRouter;