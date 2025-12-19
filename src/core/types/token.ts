export type TokenType = "personal" | "system";

export type TokenContext = {
	id: number;
	token: string;
	name: string | null;
	type: TokenType;
	allowedIps: string[];
	maxRequests: number | null;
	createdAt: number;
	expiresAt: number | null;
}