const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

export type ApiError = {
  code?: string
  message: string
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const errorMessage =
      payload?.detail ??
      payload?.error?.message ??
      payload?.message ??
      'The server could not process the request.'

    throw new Error(Array.isArray(errorMessage) ? errorMessage[0]?.msg ?? 'Request failed.' : errorMessage)
  }

  return payload.data ?? payload
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  upload: async (endpoint: string, formData: FormData) => {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'POST',
      body: formData,
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      const errorMessage =
        payload?.detail ??
        payload?.error?.message ??
        payload?.message ??
        'Upload failed.'

      throw new Error(Array.isArray(errorMessage) ? errorMessage[0]?.msg ?? 'Upload failed.' : errorMessage)
    }

    return payload.data ?? payload
  },
}

export const apiConfig = {
  baseUrl: apiBaseUrl,
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true',
}
