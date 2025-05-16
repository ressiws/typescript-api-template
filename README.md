# ⚙️ typescript-api-template

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](./LICENSE.md)
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-%233178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Built with PNPM](https://img.shields.io/badge/PNPM-%23F69220.svg?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![RESTful API](https://img.shields.io/badge/REST-API-blue)](#)

> A modular and RESTful TypeScript API template with automatic route loading and expressive logging — designed for speed, security, and structure.

# 🚀 Features
- 🔄 **Automatic Routing** \
  Drop endpoints in `src/api/` and they’re instantly available — no need to manually register routes.

- 📦 **Custom Builder Compatible**  \
  Built on top of [`typescript-template-pnpm`](https://github.com/ressiws/typescript-template-pnpm) with full support for custom builders and clean project structure.

- 📃 **REST + CRUD Only**  \
  All routes follow strict RESTful patterns, making it ideal for clean, predictable API design.

- 🧱 **Extendable Endpoint Base Class**  \
  Easily define metadata (`name`, `description`, `params`, etc.) and control access via `private`/`public`.

- 🛡️ **Built-in IP + Token Security**  \
  IP whitelisting and optional bearer token support — all configurable.

- 📁 **Modular Structure**  \
  Place routes in `src/api/` or any subfolder, and they’ll be dynamically loaded with their full path.

- 📊 **Detailed Logging**  \
  Debug and success logs using a colorful and expressive custom logger.

# 📁 Project Structure
```
├── .build/ # Builder internal state
├── scripts/ # Scripts used by the builder
├── src/ # Your TypeScript source code
├── src/config.ts # Project configuration file
└── types/ # Types used internally
```

# 🔧 Creating an Endpoint
Each endpoint must extend the `Endpoints` base class. Here's the structure:

```ts
// src/api/user.ts
import { Endpoints } from "@utils/route-loader.js";
import { Request, Response } from "express";

export default class UserEndpoint extends Endpoints {
	constructor() {
		super();
		this.name = "user";
		this.description = "Return a specific user data.";
		this.params = ["user_id"]; // Optional dynamic params in the URL
		this.version = "1.0.0";
		this.private = false; // true = requires token/IP access
	}

	public async endpoint(req: Request, res: Response): Promise<void> {
		const { user_id } = req.params;
		if (!user_id) {
			res.status(404).json({ error: "User id not found." });
			return;
		}

		res.status(200).json({ user_id, name: "John Doe" });
	}
}
```
# ✅ Endpoint Options
| Options                         | Description |
|---------------------------------|-------------|
| `name`                          | Internal name for logging/debugging |
| `description`                   | Short description of what the endpoint does |
| `params`                        | Array of URL parameters (e.g `["id"]`) |
| `version`                       | Version string for changelog/log purposes |
| `private`                       | If `true`, requires authorized IP/token |

# 🔐 Auth + Security
> Handled in `check_request()` and configurable via `config.ts`

- ✅ Allowlist by IP (allowed_ips)
- 🔑 Require Bearer Token (Authorization: Bearer <token>)

You can control this in `config.ts` and `endpoints_config` (block IPs, enforce tokens, etc.).

# 🛠 Usage
```bash
pnpm install 	# to install necessary dependencies
pnpm run build 	# to build the code
pnpm run start	# starts the api on configured port
```

# 🌍 Example Output
```md
[INFO]  Searching for endpoints in: src/api
[SUCCESS]  Successfully loaded "user-endpoint" endpoint (v1.0.0) at "/user"
[SUCCESS]  Successfully loaded api endpoints 1/1
[SUCCESS]  API Running at http://localhost:3000
```

# 💡 Ideal Use Cases
- Public/private APIs
- Admin dashboards or internal tools
- Proxies and secure backend endpoints
- Quick MPVs or automation backends

# 🧾 License
This project is licensed under the [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) — Use freely with credit. See [LICENSE.md](./LICENSE.md).

> You can use it for whatever you want — commercial or not — as long as you give credit. Don’t worry, we won't sue you for becoming a millionaire off this… probably.