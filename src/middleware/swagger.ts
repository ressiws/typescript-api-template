import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";

export async function registerSwagger(app: FastifyInstance): Promise<void> {
	await app.register(swagger, {
		openapi: {
			openapi: "3.0.3",
			info: {
				title: "API",
				description: "API documentation",
				version: "1.0.0",
			},
		},
	});

	await app.register(swaggerUi, {
		routePrefix: "/docs",
	});
}