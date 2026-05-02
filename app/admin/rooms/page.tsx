'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminRoomsApi } from '@/lib/api/admin-rooms';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { ArrowLeft, Building2, Plus, Trash2, Edit, Mic } from 'lucide-react';

interface RoomItem {
  id: string;
  name: string;
  sessions?: { id: string }[];
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token');
      const data = await adminRoomsApi.list(token);
      setRooms(data);
    } catch (err) {
      console.error('[v0] Error loading rooms:', err);
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
      await adminRoomsApi.delete(id, token);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('[v0] Error deleting room:', err);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Tableau de bord
            </Link>
            <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Salles
            </h1>
          </div>
          <Link href="/admin/rooms/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Nouvelle salle
            </motion.button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonLoader count={3} type="card" />
          </div>
        ) : rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glow rounded-2xl p-12 text-center"
          >
            <Building2 className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-400">Aucune salle</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-glow rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20">
                      <Building2 className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-white">
                        {room.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 flex items-center gap-1.5">
                        <Mic className="h-3.5 w-3.5 text-amber-400" />
                        {room.sessions?.length || 0} session(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/rooms/${room.id}/edit`}>
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
                      onClick={() => handleDelete(room.id)}
                      disabled={deleting === room.id}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:border-red-500/30 border border-slate-700/50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deleting === room.id ? '...' : 'Supprimer'}
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
