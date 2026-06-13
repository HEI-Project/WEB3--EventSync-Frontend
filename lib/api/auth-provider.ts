import { authApi } from './auth';

const isBrowser = typeof window !== 'undefined';

export const authProvider = {
  login: async ({ username, password }: { username: string; password: string }) => {
    const response = await authApi.login(username, password);
    if (isBrowser) {
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.user));
    }
  },

  logout: async () => {
    if (isBrowser) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  },

  checkAuth: async () => {
    if (!isBrowser) throw new Error('Not authenticated');
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Not authenticated');
  },

  checkError: async (error: any) => {
    if (error.status === 401 || error.status === 403) {
      if (isBrowser) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
      throw new Error('Session expired');
    }
  },

  getPermissions: async () => {
    if (!isBrowser) return null;
    const userStr = localStorage.getItem('adminUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  getIdentity: async () => {
    if (!isBrowser) throw new Error('Not authenticated');
    const userStr = localStorage.getItem('adminUser');
    if (!userStr) throw new Error('Not authenticated');
    const user = JSON.parse(userStr);
    return { id: user.id, fullName: user.email };
  },
};
