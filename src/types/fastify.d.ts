import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		startTime: number;
	}
}