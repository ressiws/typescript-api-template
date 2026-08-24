import { Bootstrapper } from "./core/bootstrapper.js";
import logger from "./logging/logger.js";

try {
	await Bootstrapper.boot();
}
catch (error) {
	logger.error(`Application failed to start: ${error}`);
	process.exitCode = 1;
}