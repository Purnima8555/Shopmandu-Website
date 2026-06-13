

import client from "../config/redis.config.js";

import { BadRequestError } from "../utils/AppError.js";

const MAX_REQUEST = 10;

const WINDOW_SECONDS = 60;

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress;
};

const readLimiting = async (req, res, next) => {
  try {
    const ipAddress = getClientIp(req);

    const key = `ratelimit:${ipAddress}`;

    const count = await client.incr(key);

    if (count === 1) {
      await client.expire(key, WINDOW_SECONDS);
    }

    const remaining = Math.max(0, MAX_REQUEST - count);

    res.set({
      "X-RateLimit-Limit": MAX_REQUEST,
      "X-RateLimit-Remaining": remaining,
      "X-RateLimit-Window": WINDOW_SECONDS,
    });

    if (count > MAX_REQUEST) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next();
  }
};

export default readLimiting;