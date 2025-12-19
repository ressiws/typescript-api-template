# Contributing Guide

## Philosophy

This project is **not a playground**.

This project is a **production-grade API base**, designed for:

* Security
* Predictability
* Maintainability

All contributions must respect these principles.

---

## What We Accept

✅ Bug fixes
✅ Security improvements
✅ Performance optimizations
✅ Documentation improvements

❌ Feature bloat
❌ Opinionated refactors without justification
❌ Magic abstractions
❌ Unreviewed dependencies

---

## Code Standards

### TypeScript

* Strict typing required
* No `any` unless explicitly justified
* Prefer explicit types over inference in public APIs

---

### Structure Rules

* One responsibility per file
* Middleware must be composable
* Services must be stateless where possible
* Helpers must be deterministic

Blurred responsibilities = automatic rejection.

---

### Error Handling

* All errors must use centralized helpers
* Error codes must come from the shared enum
* No raw `res.json` in business logic

---

### Security Rules

* Never weaken authentication or validation
* Never log secrets
* Never bypass middleware for convenience

---

## Testing & CI

* All automated checks must pass  
* Manual tests encouraged for security-critical changes

---

## Commit Guidelines

Use clear, scoped commits:

```
feat(auth): add token expiration validation
fix(rate-limit): prevent shared state leak
refactor(logging): normalize request logs
```

Avoid vague messages.

---

## Pull Request Process

1. Fork the repository
2. Create a dedicated branch
3. Make focused changes
4. Ensure the project builds and boots, and all tests pass
5. Submit a PR with a clear explanation

If you cannot explain **why** a change exists, it should not exist.

---

## Final Note

This codebase values:

* Clarity over cleverness
* Explicitness over magic
* Stability over speed

Contribute accordingly.
