import express from "express";
import logger from "./config/logger.config.js";

import { serverConfig } from "./config/index.js";
import { genericErrorHandler } from "./middlewares/error.middleware.js";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware.js";

const app = express();

app.use(express.json());
app.use(attachCorrelationIdMiddleware);

app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
    logger.info(`Server is running on ${serverConfig.PORT}`);
});