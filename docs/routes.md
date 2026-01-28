# Routes & Input Validation Guide

### Overview
This document outlines best practices for creating routes in the **typescript-api-template** using **Express**, **TypeScript**, and **Zod**.

It covers:
- Type-safe route definitions
- Input validation for `body`, `query`, and `params`
- Input sanitization
- Best practices for CRUD operations

## Route Structure
- All routes reside in `src/routes/`.
- Each file exports a `Router` object.

Example:
```ts
// health.ts
import { sendSuccess } from "../core/helpers/response.helper.js";
import type { Request, Response, Router } from "express";
import express from "express";

const router: Router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
	sendSuccess(res, "Health check passed.", { status: "ok" });
});

export default router;
```

### Recomended structure:
```bash
src/routes/
 ├─ health.ts
 ├─ users.ts
 └─ tokens.ts
```

# Using Zod for Validation
- Each route can define its **own schema** for `body`, `query`, and `params`.
- Middleware `validate(schema)` ensures type safety and automatic validation.

### Example: Create User
```ts
// routes/users.ts
import { sendSuccess } from "../core/helpers/response.helper.js";
import { validate } from "../security/validate.middleware.js";
import type { Router } from "express";
import express from "express";
import { z } from "zod";

const router: Router = express.Router();

export const createUserSchema = z.object({
  username: z.string().min(3).max(32).transform(s => s.trim()),
  email: z.string().email().transform(s => s.toLowerCase()),
  age: z.number().optional(),
});

router.post("/", validate({ body: createUserSchema }), async (req, res) => {
    const user = req.body; // Already validated
    sendSuccess(res, "User created", user);
});

export default router;
```

- **Without validation**: simply define the route handler directly.
```ts
router.get("/", (req, res) => {
    sendSuccess(res, "Health check passed.", { status: "Ok" });
});
```

# CRUD Route Patterns
- **Create**: `POST /resource` with body validation
- **Read**: `GET /resource/:id` with params validation
- **Update**: `PATCH /resource/:id` with body + params validation
- **Delete**: `DELETE /resource/:id` with params validation

# Example: Update User
```ts
// routes/users.ts
import { sendSuccess } from "../core/helpers/response.helper.js";
import { validate } from "../security/validate.middleware.js";
import type { Router } from "express";
import express from "express";
import { z } from "zod";

const router: Router = express.Router();

export const createUserSchema = z.object({
  username: z.string().min(3).max(32).optional(),
  age: z.number().optional(),
});

router.patch("/", validate({ body: createUserSchema }), async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    sendSuccess(res, `User ${id} updated`, data);
});

export default router;
```

# Best Practices
1. Always define a schema for `body`, `query`, and `params`.
2. Sanitize inputs using Zod `.transform()`.
3. Never process unvalidated data in business logic.
4. Use TypeScript types derived from Zod.
```ts
type CreateUserInput = z.infer<typeof createUserSchema>;
```
5. Attach schema to route handler for automatic validation.
6. Keep one responsibility per route file.
7. Handle errors using middleware or helper functions like `sendError()`.
