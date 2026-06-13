import type { DataProvider } from 'react-admin';
import { apiCall } from './client';

function getToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem('adminToken') || undefined;
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const data = await apiCall<any[]>(`/${resource}`);
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      data: data.slice(start, end),
      total: data.length,
    };
  },

  getOne: async (resource, params) => {
    const data = await apiCall<any>(`/${resource}/${params.id}`);
    return { data };
  },

  getMany: async (resource, params) => {
    const data = await Promise.all(
      params.ids.map((id) => apiCall<any>(`/${resource}/${id}`))
    );
    return { data };
  },

  create: async (resource, params) => {
    const token = getToken();
    const data = await apiCall<any>(`/admin/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
      token,
    });
    return { data };
  },

  update: async (resource, params) => {
    const token = getToken();
    const data = await apiCall<any>(`/admin/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
      token,
    });
    return { data };
  },

  delete: async (resource, params) => {
    const token = getToken();
    try {
      const data = await apiCall<any>(`/admin/${resource}/${params.id}`, {
        method: 'DELETE',
        token,
      });
      return { data };
    } catch {
      return { data: { id: params.id } as any };
    }
  },

  deleteMany: async (resource, params) => {
    const token = getToken();
    await Promise.all(
      params.ids.map((id) =>
        apiCall<void>(`/admin/${resource}/${id}`, {
          method: 'DELETE',
          token,
        })
      )
    );
    return { data: params.ids };
  },

  getManyReference: async (resource, params) => {
    const data = await apiCall<any[]>(`/${resource}`);
    const filtered = data.filter((item: any) =>
      item[params.target] === params.id
    );
    return { data: filtered, total: filtered.length };
  },

  updateMany: async (resource, params) => {
    const token = getToken();
    await Promise.all(
      params.ids.map((id) =>
        apiCall<any>(`/admin/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
          token,
        })
      )
    );
    return { data: params.ids };
  },
};
