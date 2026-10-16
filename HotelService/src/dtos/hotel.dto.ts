import { z } from "zod";
import {
    createHotelSchema,
    updateHotelSchema,
    hotelIdSchema,
} from "../validators/hotel.validator.js";

// Represents validated input for creating a hotel.
export type CreateHotelDto = z.infer<typeof createHotelSchema>;

// Represents validated input for updating an existing hotel.
export type UpdateHotelDto = z.infer<typeof updateHotelSchema>;

// Represents a validated hotel ID.
export type HotelIdDto = z.infer<typeof hotelIdSchema>["id"];
