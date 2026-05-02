'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminSessionsApi } from '@/lib/api/admin-sessions';
import { sessionsApi } from '@/lib/api/sessions';
import { PageTransition } from '@/components/page-transition';

export default function EditSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    capacity: '100',
    eventId: '',
    roomId: '',
    speakerIds: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    sessionsApi
      .get(sessionId)
      .then((session) => {
        setFormData({
          title: session.title,
          description: session.description,
          startTime: new Date(session.startTime).toISOString().slice(0, 16),
          endTime: new Date(session.endTime).toISOString().slice(0, 16),
          capacity: String(session.capacity),
          eventId: session.eventId,
          roomId: session.roomId,
          speakerIds: session.speakers?.map((s) => s.id).join(', ') || '',
        });
      })
      .catch((err) => {
        console.error('[v0] Error loading session:', err);
        setError('Impossible de charger la session');
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token');

      await adminSessionsApi.update(
        sessionId,
        {
          title: formData.title,
          description: formData.description,
          startTime: formData.startTime,
          endTime: formData.endTime,
          capacity: parseInt(formData.capacity, 10),
          eventId: formData.eventId,
          roomId: formData.roomId,
          speakerIds: formData.speakerIds
            ? formData.speakerIds.split(',').map((id) => id.trim()).filter(Boolean)
            : [],
        },
        token
      );
      router.push('/admin/sessions');
    } catch (err) {
      setError('Erreur lors de la modification');
      console.error('[v0] Error updating session:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
            <Link href="/admin/sessions" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Retour
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Modifier la session</h1>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="rounded-lg border border-gray-200 bg-white p-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de début *
                  </label>
                  <input
                    id="startTime"
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de fin *
                  </label>
                  <input
                    id="endTime"
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Capacité *
                  </label>
                  <input
                    id="capacity"
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                    ID de l'événement *
                  </label>
                  <input
                    id="eventId"
                    type="text"
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
                    ID de la salle *
                  </label>
                  <input
                    id="roomId"
                    type="text"
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="speakerIds" className="block text-sm font-medium text-gray-700 mb-2">
                    IDs des intervenants (séparés par des virgules)
                  </label>
                  <input
                    id="speakerIds"
                    type="text"
                    name="speakerIds"
                    value={formData.speakerIds}
                    onChange={handleChange}
                    placeholder="uuid-1, uuid-2"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting || !formData.title || !formData.startTime || !formData.endTime}
              className="mt-8 w-full rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Modification...' : 'Modifier'}
            </motion.button>
          </motion.form>
        </main>
      </div>
    </PageTransition>
  );
}
