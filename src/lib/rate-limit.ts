type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

export const getClientIp = (req: Request) => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const [first] = forwardedFor.split(',');
    const candidate = first?.trim();
    if (candidate) return candidate;
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp?.trim()) return realIp.trim();

  return 'unknown';
};

export const applyRateLimit = (
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
) => {
  const now = Date.now();
  const current = store.get(key);

  if (!current || now >= current.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  store.set(key, current);
  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
};
