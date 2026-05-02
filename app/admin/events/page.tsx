'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminEventsApi } from '@/lib/api/admin-events';
import { Event } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { ArrowLeft, Calendar, Plus, Trash2, Edit, MapPin } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token');
      const data = await adminEventsApi.list();
      setEvents(data);
    } catch (err) {
      console.error('[v0] Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      setDeleting(id);
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token');
      await adminEventsApi.delete(id, token);
      await loadEvents();
    } catch (err) {
      console.error('[v0] Error deleting event:', err);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Tableau de bord
            </Link>
            <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Événements
            </h1>
          </div>
          <Link href="/admin/events/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Nouvel événement
            </motion.button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            <SkeletonLoader count={3} type="card" />
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glow rounded-2xl p-12 text-center"
          >
            <Calendar className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-400">Aucun événement</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-glow rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-heading text-lg font-bold text-white">
                      {event.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        {new Date(event.startDate).toLocaleDateString('fr-FR')}
                      </span>
                      <span>{event.sessions?.length || 0} sessions</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 border border-slate-700/50 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Éditer
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(event.id)}
                      disabled={deleting === event.id}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:border-red-500/30 border border-slate-700/50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deleting === event.id ? '...' : 'Supprimer'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
