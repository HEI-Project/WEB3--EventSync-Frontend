'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminSessionsApi } from '@/lib/api/admin-sessions';
import { adminEventsApi } from '@/lib/api/admin-events';
import { adminRoomsApi } from '@/lib/api/admin-rooms';
import { adminSpeakersApi } from '@/lib/api/admin-speakers';
import { sessionsApi } from '@/lib/api/sessions';
import type { Event, Room, Speaker } from '@/lib/types';
import { SpeakerSelectModal } from '@/components/speaker-select-modal';
import { ArrowLeft, Mic, Users } from 'lucide-react';

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
    speakerIds: [] as string[],
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [speakerModalOpen, setSpeakerModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const tokenVal = token;

    Promise.all([
      sessionsApi.get(sessionId),
      adminEventsApi.list(),
      adminRoomsApi.list(),
      adminSpeakersApi.list(),
    ])
      .then(([session, eventsData, roomsData, speakersData]) => {
        setEvents(eventsData);
        setRooms(roomsData);
        setSpeakers(speakersData);
        setFormData({
          title: session.title,
          description: session.description,
          startTime: new Date(session.startTime).toISOString().slice(0, 16),
          endTime: new Date(session.endTime).toISOString().slice(0, 16),
          capacity: String(session.capacity),
          eventId: session.eventId,
          roomId: session.roomId,
          speakerIds: session.speakers?.map((s) => s.id) || [],
        });
      })
      .catch((err) => {
        console.error('[v0] Error loading session:', err);
        setError('Impossible de charger la session');
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpeakerToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      speakerIds: prev.speakerIds.includes(id)
        ? prev.speakerIds.filter((s) => s !== id)
        : [...prev.speakerIds, id],
    }));
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
          speakerIds: formData.speakerIds,
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
                  Événement *
                </label>
                <select
                  id="eventId"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                >
                  <option value="" className="bg-slate-900">Sélectionner un événement</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id} className="bg-slate-900">
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Salle *
                </label>
                <select
                  id="roomId"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-colors"
                >
                  <option value="" className="bg-slate-900">Sélectionner une salle</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id} className="bg-slate-900">
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Intervenants
                </label>
                <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 min-h-[2.75rem]">
                  {formData.speakerIds.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {formData.speakerIds.map((id) => {
                        const speaker = speakers.find((s) => s.id === id);
                        return speaker ? (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 border border-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-400"
                          >
                            {speaker.fullName}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeakerToggle(id);
                              }}
                              className="hover:text-violet-300 transition-colors"
                            >
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mb-2">Aucun intervenant sélectionné</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setSpeakerModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5 transition-all"
                  >
                    <Users className="h-3.5 w-3.5" />
                    {formData.speakerIds.length > 0 ? 'Modifier la sélection' : 'Ajouter des intervenants'}
                  </button>
                </div>
              </div>

            <SpeakerSelectModal
              open={speakerModalOpen}
              speakers={speakers}
              selectedIds={formData.speakerIds}
              onClose={() => setSpeakerModalOpen(false)}
              onConfirm={(ids) => setFormData((prev) => ({ ...prev, speakerIds: ids }))}
            />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting || !formData.title || !formData.startTime || !formData.endTime || !formData.eventId || !formData.roomId}
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
