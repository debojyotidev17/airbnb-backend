import { v4 as uuidv4 } from "uuid";

// Generates a unique UUID to identify an idempotent request.
export function generateIdempotencyKey(): string {
    return uuidv4();
}