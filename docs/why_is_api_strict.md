# Why is this API so strict?

Short answer: **because insecure APIs are useless**.

Long answer: keep reading.

## This API is not beginner-friendly by accident
If you are new to APIs, Express, or backend development:
- This project **will feel hostile**
- Things will “break” early
- Requests will be rejected aggressively

That is intentional.

This template is designed to:
- Fail fast
- Reject ambiguity
- Force correct configuration
- Prevent silent insecurity

If you want something permissive, magical, or plug-and-play, this is not it.

## “It works locally but not in the browser” (CORS)
Yes. That’s expected.

### Why?
Because browsers are the most common attack surface.

If `CORS_ORIGIN` is not explicitly defined:
- Requests with an `Origin` header are **blocked**
- Non-browser tools (curl, Postman, backend services) still work

This prevents:
- Accidental public exposure
- Drive-by frontend abuse
- “I didn’t know my API was public” incidents

You **must explicitly allow origins**. Silence is not consent.

## “Why do I need a token immediately?”

Because open APIs get abused in minutes.

On first startup:
- If no tokens exist, the API creates **one**
- Prints it **once**
- Never again

This guarantees:
- No open access
- No hardcoded secrets
- No “I’ll secure it later” lies

If you lose the token, that’s on you.  
Security that forgives laziness is not security.

## “Why is validation rejecting my request?”

Because invalid input should never reach business logic.

This API:
- Validates `body`, `query`, and `params`
- Rejects malformed JSON
- Rejects oversized payloads
- Rejects unexpected types

If validation fails:
- Your code is never executed
- No partial state changes happen
- No undefined behavior leaks in

If this feels annoying, imagine debugging corrupted data in production.

## “Why doesn’t it auto-fix or coerce my input?”

Because silent coercion creates bugs.

Examples of things this API will NOT do:
- Convert `"123"` into `123`
- Assume missing fields are optional
- Guess what you meant

You must be explicit.
Your schemas define reality.

## “Why is Helmet / HSTS / CSP enabled?”

Because browsers are hostile environments.

These protections exist to:
- Prevent XSS
- Prevent clickjacking
- Prevent MIME sniffing
- Prevent downgrade attacks

If you don’t understand a header:
- Do not disable it
- Learn what it does first

Security headers are not decoration.

## “This feels painful”

Good.

Pain here means:
- Less pain later
- Fewer incidents
- Fewer rewrites
- Fewer compromises

This template optimizes for:
- Long-term maintainability
- Predictable behavior
- Production safety

Not for comfort.

## Who this template is for

✅ Backend developers  
✅ Security-aware teams  
✅ Internal tools  
✅ Public APIs with real users  
✅ People who prefer correctness over convenience  

## Who this template is NOT for

❌ Tutorials  
❌ Quick demos  
❌ Hackathon glue code  
❌ “I’ll secure it later” projects  

## Final warning

If you loosen this API without understanding **why** it is strict,
you are not customizing it, you are **removing guarantees**.

Do that consciously.

Or don’t use this template.