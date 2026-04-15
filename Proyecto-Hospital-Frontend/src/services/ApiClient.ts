type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider | null = null;

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
  const baseUrl = process.env.EXPO_PUBLIC_API_HOSPITAL;
  if (!baseUrl) {
    throw new Error('Falta EXPO_PUBLIC_API_HOSPITAL en el archivo .env');
  }
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function resolveUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${getBaseUrl()}${cleanPath}`;
}

async function parseResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return res.json();
  const text = await res.text();
  return text ? text : null;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options?: {
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  },
): Promise<T> {
  const accessToken = tokenProvider ? await tokenProvider() : null;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options?.headers ?? {}),
  };

  let body: string | undefined;
  if (options?.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  const response = await fetch(resolveUrl(path), {
    method,
    headers,
    body,
    signal: options?.signal,
  });

  const parsedBody = await parseResponse(response);
  if (!response.ok) {
    throw new ApiError(`Error ${method} ${path}`, response.status, parsedBody);
  }

  return parsedBody as T;
}

export const ApiClient = {
  setTokenProvider: (provider: TokenProvider | null) => {
    tokenProvider = provider;
  },
  get: <T>(path: string, options?: { headers?: Record<string, string>; signal?: AbortSignal }) =>
    request<T>('GET', path, options),
  post: <T>(
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; signal?: AbortSignal },
  ) => request<T>('POST', path, { ...options, body }),
  put: <T>(
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; signal?: AbortSignal },
  ) => request<T>('PUT', path, { ...options, body }),
  patch: <T>(
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; signal?: AbortSignal },
  ) => request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: { headers?: Record<string, string>; signal?: AbortSignal }) =>
    request<T>('DELETE', path, options),
};

