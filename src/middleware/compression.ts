import compress from "@fastify/compress";
import type { FastifyInstance } from "fastify";

export async function registerCompression(app: FastifyInstance): Promise<void> {
	await app.register(compress, {
		global: true,
	});
}