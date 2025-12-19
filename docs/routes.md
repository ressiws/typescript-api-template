# Routes & Input Validation Guide
### Overview
This document outlines best practices for creating routes in the **typescript-api-template** using **Express**, **TypeScript**, and **Zod**.

It focuses on:
- Structured and type-safe route definitions
- Input validation for `body`, `query`, and `params`
- Input sanitization to prevent unsafe data from reaching business logic
- Consistency with global middleware and error handling

# Route Structure
All routes should reside under `src/routes/`. Each file should export a router object:
```ts
import { Router } from "express";
export const router = Router();

// Example route
router.get("/health", (_req, res) => res.json({ status: "ok" }));
```

Recommended file layout:
```bash
src/routes/
 ├─ health.ts
 ├─ users.ts
 └─ tokens.ts
```

# Zod Schemas for Validation
### Why zod?
- Ensures type-safe validation
- Fail-fast on invalid input
- Supports transformations and sanitization
- Integrates with the global `validateMiddleware`

### Schema Definition
Define a schema per route:
```ts
import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(32).transform(s => s.trim()),
  email: z.string().email().transform(s => s.toLowerCase()),
  password: z.string().min(8),
  age: z.number().optional()
});
```

Attach the schema to the route handler:
```ts
router.post("/users", (req, res, next) => {
  const handler = async () => {
    const user = req.body; // Already validated
    res.json({ status: "success", data: user, code: "SUCCESS" });
  };
  handler().catch(next);
});

// attach schema for middleware
(router.stack[router.stack.length - 1].handle as any).schema = {
  body: createUserSchema
};
```

# Input Sanitization
- **Trim strings**: remove extra spaces.
- **Normalize email**: lowercase to ensure uniqueness.
- **Escape HTML**: prevent XSS in string fields.
- **Parse numbers**: reject NaN or invalid numeric strings.

Example with Zod transforms:
```ts
const sanitizedSchema = z.object({
  username: z.string().min(3).max(32).transform(s => s.trim()),
  email: z.string().email().transform(s => s.toLowerCase()),
  age: z.preprocess(val => Number(val), z.number().min(0).max(120).optional())
});
```

# Route Types
Use **TypeScript types** derived from Zod to ensure type safety:
```ts
import type { infer as zInfer } from "zod";

type CreateUserInput = z.infer<typeof createUserSchema>;
```

This guarantees your route handlers use fully validated and sanitized data.

# Error Handling
- All validation errors are handled automatically by `validateMiddleware`.
- Your handler will **never receive invalid input**.
- For custom errors in business logic, throw an `Error` or use `sendError(res, code)` helper.

# Example: Full Route
```ts
import { Router } from "express";
import { z } from "zod";
import { sendSuccess } from "@/core/helpers/response.helper";

const router = Router();

export const createUserSchema = z.object({
  username: z.string().min(3).max(32).transform(s => s.trim()),
  email: z.string().email().transform(s => s.toLowerCase()),
  age: z.number().optional()
});

router.post("/users", async (req, res) => {
  const user = req.body; // Already validated and sanitized
  // business logic...
  sendSuccess(res, "User created", user);
});

// Attach schema to handler for middleware
(router.stack[router.stack.length - 1].handle as any).schema = {
  body: createUserSchema
};

export default router;
```

# Best Practices Summary
1. **Always define a schema** for `body`, `query`, and `params`.
2. **Sanitize inputs** using Zod transforms.
3. **Never process unvalidated data** in business logic.
4. **Use TypeScript types from Zod** to ensure consistency.
5. **Attach schema to route handler** for automatic middleware validation.
6. **Throw errors via helpers** instead of raw responses.
7. **Keep routes focused**: one responsibility per file.