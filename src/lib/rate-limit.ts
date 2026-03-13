import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

/**
 * Create a rate limiter instance using Upstash Redis.
 *
 * @param requests - Number of requests allowed in the window
 * @param window - Time window (e.g., "10 s", "1 m", "1 h")
 */
export function rateLimit(requests: number = 10, window: string = "10 s") {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
    analytics: true,
  });
}

/**
 * Wrapper for API route handlers that enforces rate limiting.
 * Identifies users by IP address or a custom identifier.
 *
 * @param handler - The API route handler to wrap
 * @param options - Rate limit configuration
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  options: { requests?: number; window?: string; identifier?: (req: Request) => string } = {}
) {
  const { requests = 10, window = "10 s", identifier } = options;
  const limiter = rateLimit(requests, window);

  return async (request: Request): Promise<Response> => {
    const id =
      identifier?.(request) ??
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "anonymous";

    const { success, limit, reset, remaining } = await limiter.limit(id);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    return handler(request);
  };
}
