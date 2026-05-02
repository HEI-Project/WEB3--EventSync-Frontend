import { apiCall } from './client';
import type { Question } from '@/lib/types';

export const questionsApi = {
  get: (sessionId: string) => apiCall<Question[]>(`/sessions/${sessionId}/questions`),
  ask: (sessionId: string, content: string, authorName?: string) =>
    apiCall(`/sessions/${sessionId}/questions`, {
      method: 'POST',
      body: JSON.stringify({ content, authorName }),
    }),
  upvote: (id: string) =>
    apiCall(`/questions/${id}/upvote`, { method: 'POST' }),
};
