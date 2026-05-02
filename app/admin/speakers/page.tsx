'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminSpeakersApi } from '@/lib/api/admin-speakers';
import { Speaker } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { ArrowLeft, Users, Plus, Trash2, Edit, Mic } from 'lucide-react';

export default function AdminSpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadSpeakers();
  }, []);

  const loadSpeakers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token');
      const data = await adminSpeakersApi.list(token);
      setSpeakers(data);
    } catch (err) {
      console.error('[v0] Error loading speakers:', err);
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
      await adminSpeakersApi.delete(id, token);
      setSpeakers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('[v0] Error deleting speaker:', err);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Tableau de bord
            </Link>
            <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Intervenants
            </h1>
          </div>
          <Link href="/admin/speakers/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Nouvel intervenant
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonLoader count={3} type="card" />
          </div>
        ) : speakers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glow rounded-2xl p-12 text-center"
          >
            <Users className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-400">Aucun intervenant</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {speakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-glow rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 border border-cyan-500/20 text-lg font-bold text-cyan-400">
                      {speaker.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-white">
                        {speaker.fullName}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
                        <Mic className="h-3.5 w-3.5 text-emerald-400" />
                        {speaker.sessions?.length || 0} session(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/speakers/${speaker.id}/edit`}>
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
                      onClick={() => handleDelete(speaker.id)}
                      disabled={deleting === speaker.id}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:border-red-500/30 border border-slate-700/50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deleting === speaker.id ? '...' : 'Supprimer'}
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
