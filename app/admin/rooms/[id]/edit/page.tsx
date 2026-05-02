'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminRoomsApi } from '@/lib/api/admin-rooms';
import { PageTransition } from '@/components/page-transition';

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const [formData, setFormData] = useState({
    name: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Non authentifié');
      setLoading(false);
      return;
    }

    adminRoomsApi
      .list(token)
      .then((rooms) => {
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
          setFormData({ name: room.name });
        } else {
          setError('Salle non trouvée');
        }
      })
      .catch((err) => {
        console.error('[v0] Error loading room:', err);
        setError('Impossible de charger la salle');
      })
      .finally(() => setLoading(false));
  }, [roomId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      await adminRoomsApi.update(
        roomId,
        { name: formData.name },
        token
      );
      router.push('/admin/rooms');
    } catch (err) {
      setError('Erreur lors de la modification');
      console.error('[v0] Error updating room:', err);
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
            <Link href="/admin/rooms" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Retour
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Modifier la salle</h1>
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la salle *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Salle A, Amphithéâtre..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting || !formData.name}
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
