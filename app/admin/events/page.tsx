'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, adminApi } from '@/lib/api';
import { Event } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { PageTransition } from '@/components/page-transition';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.events.list();
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
      await adminApi.events.delete(id, token);
      await loadEvents();
    } catch (err) {
      console.error('[v0] Error deleting event:', err);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                  ← Tableau de bord
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Événements</h1>
              </div>
              <Link href="/admin/events/new">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700">
                  + Nouvel événement
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonLoader count={3} />
          ) : events.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-gray-600">Aucun événement</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border border-gray-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900">
                        {event.title}
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        {event.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>📍 {event.location}</span>
                        <span>
                          📅{' '}
                          {new Date(event.startDate).toLocaleDateString(
                            'fr-FR'
                          )}
                        </span>
                        <span>{event.sessions?.length || 0} sessions</span>
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <button className="rounded px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100">
                          Éditer
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deleting === event.id}
                        className="rounded px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deleting === event.id ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
