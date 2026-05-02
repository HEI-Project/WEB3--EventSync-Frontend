'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/page-transition';

export default function AdminSessionsPage() {
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
                <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
              </div>
              <Link href="/admin/sessions/new">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700">
                  + Nouvelle session
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center"
          >
            <p className="text-gray-600">Gestion des sessions à venir</p>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
