export type HttpMethod =
	| "GET"
	| "POST"
	| "PUT"
	| "PATCH"
	| "DELETE";

export interface RouteDefinition {
	method: HttpMethod;
	path: string;
	handler: (...args: never[]) => unknown;
}