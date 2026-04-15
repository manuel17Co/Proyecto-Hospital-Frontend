type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function getBaseUrl(): string {
  const raw = process.env.EXPO_PUBLIC_API_HOSPITAL;
  if (!raw) {
    throw new Error(
      'Missing EXPO_PUBLIC_API_HOSPITAL in .env (example: EXPO_PUBLIC_API_HOSPITAL=http://localhost:8080/)',
    );
  }
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

function joinUrl(baseUrl: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

async function parseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return await res.json();
  }
  const text = await res.text();
  return text.length ? text : undefined;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options?: {
    headers?: Record<string, string>;
    body?: unknown;
    signal?: AbortSignal;
  },
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = joinUrl(baseUrl, path);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options?.headers ?? {}),
  };

  let body: BodyInit | undefined;
  if (options?.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
    body =
      headers['Content-Type'].includes('application/json') ? JSON.stringify(options.body) : (options.body as any);
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
    signal: options?.signal,
  });

  if (!res.ok) {
    const parsed = await parseBody(res);
    throw new ApiError(`Request failed: ${method} ${path}`, res.status, parsed);
  }

  const parsed = await parseBody(res);
  return parsed as T;
}

export const ApiClient = {
  get: <T>(path: string, options?: { headers?: Record<string, string>; signal?: AbortSignal }) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: { headers?: Record<string, string>; signal?: AbortSignal }) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: { headers?: Record<string, string>; signal?: AbortSignal }) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: { headers?: Record<string, string>; signal?: AbortSignal }) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: { headers?: Record<string, string>; signal?: AbortSignal }) =>
    request<T>('DELETE', path, options),
};

