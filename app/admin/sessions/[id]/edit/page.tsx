'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminSessionsApi } from '@/lib/api/admin-sessions';
import { sessionsApi } from '@/lib/api/sessions';
import { ArrowLeft, Mic } from 'lucide-react';

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

  if (loading) return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
      <p className="text-slate-400">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/admin/sessions" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Sessions
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Modifier <span className="text-gradient">la session</span>
          </h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card-glow rounded-2xl p-6 sm:p-8"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1.5">
                Titre *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Heure de début *
                </label>
                <input
                  id="startTime"
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Heure de fin *
                </label>
                <input
                  id="endTime"
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-slate-300 mb-1.5">
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
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="eventId" className="block text-sm font-medium text-slate-300 mb-1.5">
                  ID de l'événement *
                </label>
                <input
                  id="eventId"
                  type="text"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-slate-300 mb-1.5">
                  ID de la salle *
                </label>
                <input
                  id="roomId"
                  type="text"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="speakerIds" className="block text-sm font-medium text-slate-300 mb-1.5">
                  IDs des intervenants
                </label>
                <input
                  id="speakerIds"
                  type="text"
                  name="speakerIds"
                  value={formData.speakerIds}
                  onChange={handleChange}
                  placeholder="uuid-1, uuid-2"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting || !formData.title || !formData.startTime || !formData.endTime}
            className="btn-primary mt-8 w-full py-2.5 text-sm flex items-center justify-center gap-2"
          >
            <Mic className="h-4 w-4" />
            {submitting ? 'Modification...' : 'Modifier'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
