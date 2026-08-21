import { Bootstrapper } from "./core/bootstrapper.js";
import { logger } from "./logging/logger.js";

try {
	await Bootstrapper.boot();
}
catch (error) {
	logger.error({ category: "SYSTEM", err: error, }, "Application failed to start",);
	process.exitCode = 1;
}