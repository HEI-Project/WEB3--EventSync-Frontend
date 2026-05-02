const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...fetchOptions } = options || {};

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Public endpoints
export const api = {
  events: {
    list: () => apiCall('/events'),
    get: (id: string) => apiCall(`/events/${id}`),
  },
  sessions: {
    get: (id: string) => apiCall(`/sessions/${id}`),
    getQuestions: (id: string) => apiCall(`/sessions/${id}/questions`),
    askQuestion: (id: string, content: string, authorName?: string) =>
      apiCall(`/sessions/${id}/questions`, {
        method: 'POST',
        body: JSON.stringify({ content, authorName }),
      }),
  },
  questions: {
    upvote: (id: string) =>
      apiCall(`/questions/${id}/upvote`, { method: 'POST' }),
  },
  speakers: {
    list: () => apiCall('/speakers'),
    get: (id: string) => apiCall(`/speakers/${id}`),
  },
  rooms: {
    list: () => apiCall('/rooms'),
  },
};

// Admin endpoints
export const adminApi = {
  auth: {
    login: (email: string, password: string) =>
      apiCall('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, password: string) =>
      apiCall('/admin/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  events: {
    create: (data: any, token: string) =>
      apiCall('/admin/events', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    update: (id: string, data: any, token: string) =>
      apiCall(`/admin/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    delete: (id: string, token: string) =>
      apiCall(`/admin/events/${id}`, {
        method: 'DELETE',
        token,
      }),
  },
  sessions: {
    create: (data: any, token: string) =>
      apiCall('/admin/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    update: (id: string, data: any, token: string) =>
      apiCall(`/admin/sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    delete: (id: string, token: string) =>
      apiCall(`/admin/sessions/${id}`, {
        method: 'DELETE',
        token,
      }),
  },
  speakers: {
    create: (data: any, token: string) =>
      apiCall('/admin/speakers', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    update: (id: string, data: any, token: string) =>
      apiCall(`/admin/speakers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    delete: (id: string, token: string) =>
      apiCall(`/admin/speakers/${id}`, {
        method: 'DELETE',
        token,
      }),
  },
  rooms: {
    create: (data: any, token: string) =>
      apiCall('/admin/rooms', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),
    update: (id: string, data: any, token: string) =>
      apiCall(`/admin/rooms/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      }),
    delete: (id: string, token: string) =>
      apiCall(`/admin/rooms/${id}`, {
        method: 'DELETE',
        token,
      }),
  },
};
