// Rate Limiter implementation using the Token Bucket strategy.
// Supports both IP and User-based rate limiting key entries.

import { getRequest } from "@tanstack/react-start/server";

interface Bucket {
  tokens: number;
  lastRefill: number;
}

// In-memory bucket store
const activeBuckets = new Map<string, Bucket>();

/**
 * Returns the client's public IP address from request headers.
 */
export function getClientIp(): string {
  const request = getRequest();
  if (!request || !request.headers) return "127.0.0.1";
  
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    // Return first element in proxy chain list
    return xForwardedFor.split(",")[0].trim();
  }
  
  return (
    request.headers.get("x-real-ip") || 
    request.headers.get("cf-connecting-ip") || 
    "127.0.0.1"
  );
}

/**
 * Checks if a specific key has exceeded its rate limit limits.
 * Uses a standard token bucket capacity calculation.
 * 
 * @param key Unique key identifier (e.g. `ip:1.2.3.4` or `user:uuid`)
 * @param limit Bucket size limit (max capacity)
 * @param intervalMs Time period to completely refill the bucket tokens in milliseconds
 */
export function checkRateLimit(key: string, limit: number, intervalMs: number): boolean {
  const now = Date.now();
  let bucket = activeBuckets.get(key);

  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
    activeBuckets.set(key, bucket);
  }

  // Calculate tokens to add since last check
  const elapsed = now - bucket.lastRefill;
  const refillRate = limit / intervalMs;
  const tokensToAdd = elapsed * refillRate;
  
  bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true; // Allowed
  }
  
  return false; // Rate limited
}

/**
 * Throws a Web API 429 Response standard if rate limiting is triggered.
 */
export function enforceRateLimit(key: string, limit: number, intervalMs: number) {
  const allowed = checkRateLimit(key, limit, intervalMs);
  if (!allowed) {
    throw new Response(
      JSON.stringify({ 
        error: "Too many requests. Please slow down and try again later." 
      }), 
      {
        status: 429,
        headers: { 
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(intervalMs / 1000))
        }
      }
    );
  }
}
