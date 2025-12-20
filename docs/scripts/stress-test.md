# Stress Test Script for [typescipt-api-template](https://github.com/ressiws/typescript-api-template)

This script is designed to stress test the [typescipt-api-template](https://github.com/ressiws/typescript-api-template) using [k6](https://k6.io/) and automatically read all endpoints from the project. It ensures all routes, authentication, rate limits, and general API stability are working under load.

# Table of Contents
1. [Purpose](#purpose)
2. [Setup](#setup)
3. [Generating Endpoints](#generating-endpoints)
4. [Running the Stress Test](#running-the-stress-test)
1. [Understanding the Results](##understanding-the-results)

# Purpose
The stress test is intended to:

- Validate all **API routes** under load.
- Ensure **token authentication** and **IP restrictions** are enforced correctly.
- Check **rate limiting** and its behavior under repeated requests.
- Provide a **baseline performance metric** for latency, throughput, and request failures.

# Setup
### Requirements
- Node.js >= 18
- [k6](https://k6.io/)
- Your API running locally or on a test enviroment.

# Generating Endpoints
The stress test reads all routes automatically. To generate the `endpoints.txt` file:
```bash
node scripts/generate-endpoints.js
```
This will:
1. Scan the `src/routes/` folder for `.ts` or `js` route files. \
2. Write all discovered routes into `scripts/endpoints.txt`
3. Ensure your stress test is always up-to-date with your current API structure.

**Example output**:
```bash
/health
/tokens
/users
/auth
```

# Running the Stress Test
Once `endpoints.txt` is generated:
```bash
k6 run scripts/stress-test.js
```

### Key Points
- The script uses **virtual users (VUs)** to simulate concurrent traffic.
- Requests are randomized across all endpoints.
- Each request is checked for **status 200** and valid responses.
- Failures and success metrics are logged in the console.

# Configuration
The script includes configurable parameters:
- `VU` - Number of concurrent virtual users (default: 20)
- `DURATION` - Duration of the test (default 30s)
- `API_URL` - Base URL of your API (default `http://localhost:3000`)

You can edit stress-test.js to adjust these values or create enviroment variables for dynamic configuraition.

# Understanding the Results
After running the script, k6 will display a summary:
```makefile

```

### Key Metrics
- **Checks** - Percentage of requests that returned expected status or response.
- **HTTP request duration** – Latency for requests.
- **HTTP requests** - Total number of requests sent.
- **VU** - Active virtual users during the test.

# Best Practices
- Always run stress tests against a **test or staging environment**, not production.
- Regenerate ``endpoints.txt`` whenever new routes are added.
- Monitor CPU, memory, and DB load to detect bottlenecks.
- Use **Grafana + k6 cloud** for advanced visualization of stress test metrics.

> [!NOTE]  
> **This script was written specifically for k6** using the above configuration to provide automated, accurate, and repeatable stress testing for typescript-api-template.

> [!IMPORTANT]  
> Before executing this stress test, make sure to review your API configuration:

**1. Rate Limits**
The API enforces rate limits per token or IP. if the `MaxRequests`or `WindowMs` is too low, the test will immediately hit the limit and fail all requests. Consider temporarily increasing these values or using multiple tokens for stress testing.

**2. Valid Tokens**
Ensure all tokens used in the `TOKENS` array are active and have access to the endpoints being tested. Invalid or expired tokens will cause failed requests.

**3. IP Whitelist**
If the API restricts requests to specific IPs, make sure your testing machine’s IP is whitelisted. Otherwise, unauthorized warnings or failures will occur.

**4. Virtual Users and Duration**
Set the number of VUs and test duration according to the server’s capacity. Overloading with too many VUs may produce false failures due to resource limits.

**5. Expect Failures If Limits Are Hit**
Seeing failed checks in k6 may not indicate a bug in your API, but rather that the stress test exceeded the configured limits. Always cross-check with your API logs.