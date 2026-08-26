import type {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
} from "fastify";

import type { HttpMethod } from "../types/routes.js";

interface RouteResult {
	status: number;
	data: unknown;
}

type RouteHandler = (
	request: FastifyRequest,
	reply: FastifyReply,
) => unknown | RouteResult | Promise<unknown | RouteResult>;

interface Route {
	method: HttpMethod;
	path: string;
	handler: RouteHandler;
}

export interface Router {
	get(path: string, handler: RouteHandler): void;
	post(path: string, handler: RouteHandler): void;
	put(path: string, handler: RouteHandler): void;
	patch(path: string, handler: RouteHandler): void;
	delete(path: string, handler: RouteHandler): void;
	register(app: FastifyInstance, prefix: string): void;
}

export function createRouter(): Router {
	const routes: Route[] = [];

	const add = (
		method: HttpMethod,
		path: string,
		handler: RouteHandler,
	): void => {
		routes.push({
			method,
			path,
			handler,
		});
	};

	return {
		get: (path, handler) => add("GET", path, handler),
		post: (path, handler) => add("POST", path, handler),
		put: (path, handler) => add("PUT", path, handler),
		patch: (path, handler) => add("PATCH", path, handler),
		delete: (path, handler) => add("DELETE", path, handler),

		register: (app, prefix) => {
			for (const route of routes) {
				const routePath =
					route.path === "/"
						? prefix
						: `${prefix}${route.path}`;

				app.route({
					method: route.method,
					url: routePath,
					handler: async (request, reply) => {
						const result = await route.handler(request, reply);

						if (
							result &&
							typeof result === "object" &&
							"status" in result &&
							"data" in result
						) {
							const { status, data } = result as RouteResult;
							return reply.status(status).send(data);
						}

						return result;
					},
				});
			}
		},
	};
}