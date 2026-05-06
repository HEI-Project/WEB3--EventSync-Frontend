'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminSessionsApi } from '@/lib/api/admin-sessions';
import { Session } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { ArrowLeft, Mic, Plus, Trash2, Edit, Clock, MapPin, Users } from 'lucide-react';

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token');
      const data = await adminSessionsApi.list();
      setSessions([data]);
    } catch (err) {
      console.error('[v0] Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  console.log(sessions);
  

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return;

    try {
      setDeleting(id);
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token');
      await adminSessionsApi.delete(id, token);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('[v0] Error deleting session:', err);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Tableau de bord
            </Link>
            <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Sessions
            </h1>
          </div>
          <Link href="/admin/sessions/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Nouvelle session
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonLoader count={3} type="card" />
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glow rounded-2xl p-12 text-center"
          >
            <Mic className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-400">Aucune session</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-glow rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="font-heading text-lg font-bold text-white">
                      {session.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                      {session.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-violet-400" />
                        {new Date(session.startTime).toLocaleString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-violet-400" />
                        {session.room?.name || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-violet-400" />
                        {session.capacity}
                      </span>
                      <span>{session.speakers?.length || 0} intervenant(s)</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/sessions/${session.id}/edit`}>
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
                      onClick={() => handleDelete(session.id)}
                      disabled={deleting === session.id}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:border-red-500/30 border border-slate-700/50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deleting === session.id ? '...' : 'Supprimer'}
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
