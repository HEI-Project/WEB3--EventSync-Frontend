'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminRoomsApi } from '@/lib/api/admin-rooms';
import { ArrowLeft, Building2 } from 'lucide-react';

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
      .list()
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

  if (loading) return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
      <p className="text-slate-400">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/admin/rooms" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Salles
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Modifier <span className="text-gradient">la salle</span>
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
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
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
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-colors"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting || !formData.name}
            className="btn-primary mt-8 w-full py-2.5 text-sm flex items-center justify-center gap-2"
          >
            <Building2 className="h-4 w-4" />
            {submitting ? 'Modification...' : 'Modifier'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
