'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { speakersApi } from '@/lib/api/speakers';
import { adminSpeakersApi } from '@/lib/api/admin-speakers';
import { Speaker } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { PageTransition } from '@/components/page-transition';

export default function AdminSpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadSpeakers();
  }, []);

  const loadSpeakers = async () => {
    try {
      const data = await speakersApi.list();
      setSpeakers(data as Speaker[]);
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
    <PageTransition>
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                  ← Tableau de bord
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Intervenants</h1>
              </div>
              <Link href="/admin/speakers/new">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700">
                  + Nouvel intervenant
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonLoader count={3} />
          ) : speakers.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-gray-600">Aucun intervenant</p>
            </div>
          ) : (
            <div className="space-y-4">
              {speakers.map((speaker, index) => (
                <motion.div
                  key={speaker.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border border-gray-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-lg font-bold text-white">
                        {speaker.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {speaker.fullName}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {speaker.sessions?.length || 0} session(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/speakers/${speaker.id}/edit`}>
                        <button className="rounded px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100">
                          Éditer
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(speaker.id)}
                        disabled={deleting === speaker.id}
                        className="rounded px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deleting === speaker.id ? 'Suppression...' : 'Supprimer'}
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
