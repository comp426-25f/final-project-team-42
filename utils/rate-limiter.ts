/**
 * Simple in-memory rate limiter
 * Tracks requests per user/IP to prevent API abuse
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Store rate limit data in memory (note: resets on server restart)
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Check if a user has exceeded their rate limit
 * @param identifier - User ID or IP address
 * @param maxRequests - Maximum requests allowed in the time window
 * @param windowMs - Time window in milliseconds (default: 1 minute)
 * @returns Object with success status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute default
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // If no record exists or the time window has passed, create/reset
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  // If within time window, check if limit exceeded
  if (record.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count += 1;
  rateLimitStore.set(identifier, record);

  return {
    success: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Clean up old rate limit records (optional maintenance function)
 * Call this periodically to prevent memory leaks
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

