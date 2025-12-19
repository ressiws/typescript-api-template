import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import http from "k6/http";

// Load endpoints from file (generated with generate-endpoints.js)
const endpoints = new SharedArray("API Endpoints", function () {
	return open("./endpoints.txt")
		.split("\n")
		.map(e => e.trim())
		.filter(Boolean);
});

// Configurable options
export const options = {
	vus: 20,           // virtual users
	duration: "2s",   // total duration
	thresholds: {
		http_req_failed: ["rate<0.05"], // <5% of requests should fail
		http_req_duration: ["p(95)<200"], // 95% requests under 200ms
	},
};

// Base API URL
const API_URL = "http://localhost:3000";
const TOKENS = [
	"sk_test_123",
];

// Utility to pick a random endpoint
function randomEndpoint() {
	return endpoints[Math.floor(Math.random() * endpoints.length)];
}

function randomToken() {
	return TOKENS[Math.floor(Math.random() * TOKENS.length)];
}

export default function () {
	const endpoint = randomEndpoint();
	const token = randomToken();
	const url = `${API_URL}${endpoint}`;

	const headers = {
		"Authorization": `Bearer ${token}`,
	};

	const res = http.get(url, { headers, tags: { endpoint } });

	const result = check(res, {
		"status is 200": r => r.status === 200,
	});

	if (!result) {
		console.warn(`❌ Endpoint failed: ${endpoint}, status: ${res.status}`);
	}
	else {
		console.info(`✅ Endpoint succeeded: ${endpoint}`);
	}

	// Sleep a tiny random amount to spread requests
	sleep(Math.random() * 0.1);
}
