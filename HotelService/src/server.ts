import express from "express";
import logger from "./config/logger.config.js";
import hotelRouter from "./routers/hotel.router.js";

import { serverConfig } from "./config/index.js";
import { genericErrorHandler } from "./middlewares/error.middleware.js";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware.js";

const app = express();

app.use(express.json());
app.use(attachCorrelationIdMiddleware);

// Registers all hotel endpoints under the /hotels prefix.
app.use("/hotels", hotelRouter);

// Handles errors forwarded by routes and middleware.
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
    logger.info(`hotelService is running on port ${serverConfig.PORT}`);
});