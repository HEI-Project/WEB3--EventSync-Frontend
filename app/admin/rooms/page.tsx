'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { roomsApi } from '@/lib/api/rooms';
import { adminRoomsApi } from '@/lib/api/admin-rooms';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { PageTransition } from '@/components/page-transition';

interface RoomItem {
  id: string;
  name: string;
  sessions?: any[];
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
      const data = await roomsApi.list();
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
    <PageTransition>
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                  ← Tableau de bord
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Salles</h1>
              </div>
              <Link href="/admin/rooms/new">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700">
                  + Nouvelle salle
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <SkeletonLoader count={3} />
          ) : rooms.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-gray-600">Aucune salle</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border border-gray-200 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {room.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {room.sessions?.length || 0} session(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/rooms/${room.id}/edit`}>
                        <button className="rounded px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100">
                          Éditer
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(room.id)}
                        disabled={deleting === room.id}
                        className="rounded px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deleting === room.id ? 'Suppression...' : 'Supprimer'}
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
