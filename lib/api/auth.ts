import { apiCall } from './client';
import type { AuthResponse } from '@/lib/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiCall<AuthResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string) =>
    apiCall<AuthResponse>('/admin/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
