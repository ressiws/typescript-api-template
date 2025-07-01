# ⚙️ typescript-api-template

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](./LICENSE.md)
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-%233178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Built with PNPM](https://img.shields.io/badge/PNPM-%23F69220.svg?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![RESTful API](https://img.shields.io/badge/REST-API-blue)](#)

> A modular, RESTful TypeScript API template with automatic route loading, flexible router endpoints, and expressive logging — designed for speed, security, and clarity.

# 🚀 Features
- 🔄 **Automatic Routing** \
  Drop your route files in `src/api/` and they are loaded with their full path automatically — no manual route registration needed.

- 🧩 **Middleware System** \
  - **Global Middleware**: Runs on every request, logs incoming requests, and can handle general preprocessing.
  - **Route Middleware**: Runs per-route, enforcing IP whitelisting, bearer token authentication, and route-specific metadata validation.

- 📦 **Modular Router Endpoints** \
  Each API endpoint exports a Router instance with any HTTP methods you want (GET, POST, DELETE, etc.) and a config object with metadata (name, description, version, private, params).

- 🛡️ **Built-in Security**  \
  IP whitelisting and optional Bearer token authorization, configurable globally.

- 📋 **Clear Endpoint Metadata** \
  Each route exports metadata (name, description, version, private) for logging, security, and maintainability.

- 🧱 **Extendable Endpoint Routers** \
  Easily define your Express routers alongside metadata.

- 📊 **Detailed Logging**  \
  Colorful and detailed logging to track loaded endpoints and requests.

- 🌍 **Built-in CORS & Compression** \
  Automatically enabled for improved security and performance.

# 📁 Project Structure
```
├── .build/            # Builder internal files
├── scripts/           # Build and utility scripts
├── src/               # Source TypeScript code
│   ├── api/           # API endpoint routers here
│   ├── middleware.ts  # Global middleware
│   ├── utils/         # Helpers and utilities
│   ├── config.ts      # Configuration file (security, tokens, IPs)
│   └── route-loader.ts# Dynamic route loader and middleware
└── types/             # TypeScript types
```

# 🛠 Usage
```bash
pnpm install     # install dependencies
pnpm run build   # build TypeScript code
pnpm run start   # start API server
```

# 🔧 Creating an Endpoint
Each endpoint exports two things:

1. A config object with metadata about the endpoint
2. A default export of an Express Router with your HTTP method handlers

Example: `/src/api/status.ts`

```ts
import { Router, Request, Response } from "express";
import type { EndpointMeta } from "@utils/route-loader.js";

export const config: EndpointMeta = {
	name: "status",
	description: "Returns API status",
	version: "1.0.0",
	private: false,
};

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		service: `https://github.com/ressiws`,
		version: `1.0.0`,
		online: true,
		uptime: `${Math.floor(process.uptime())}s`,
		platform: process.platform,
	});
});

export default router;
```

# 🛡️ **Middleware Explained** \
  - **Global Middleware**: Runs for every incoming request before routing, logging request method, URL, and client IP.
  - **Route Middleware**: Runs per route after routeMeta is assigned. Validates:
    - If the route is private, only allows requests from whitelisted IPs or a valid Bearer token if enabled.
    - Sends proper HTTP errors (401, 403, 404) on failure.

This system ensures security and centralized request handling.

# ✅ Endpoint Metadata Options
| Property                        | Description |
|---------------------------------|-------------|
| `name`                          | Internal endpoint name (used for logs) |
| `description`                   | Brief description of what the endpoint does |
| `version`                       | Version string (e.g., `1.0.0`) for changelog tracking |
| `private`                       | If `true`, enforces IP/token access restrictions |

# 🔐 **Configuration (`config.ts`)** \
  - `api_port`: Port the API listens on
  - `api_base_url`: Base URL for logging
  - `allowed_ips`: List of IPs allowed to access private routes
  - `require_token`: Enable/disable bearer token validation
  - `api_token`: The secret token for authorization
  - `maintenance`: Maintenance mode flag (logs warnings)

# 💡 Ideal Use Cases
  - Public or private REST APIs
  - Admin dashboards or backend tools
  - Secure proxy endpoints
  - Rapid MVP or automation backends

# 🧾 License
This project is licensed under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) — Use freely with credit. See [LICENSE.md](./LICENSE.md).

> You can use it for whatever you want — commercial or not — as long as you give credit. Don’t worry, we won't sue you for becoming a millionaire off this… probably.
