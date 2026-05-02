'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminSpeakersApi } from '@/lib/api/admin-speakers';
import { speakersApi } from '@/lib/api/speakers';
import { PageTransition } from '@/components/page-transition';

export default function EditSpeakerPage() {
  const router = useRouter();
  const params = useParams();
  const speakerId = params.id as string;
  const [formData, setFormData] = useState({
    fullName: '',
    photoUrl: '',
    bio: '',
    externalLinks: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    speakersApi
      .get(speakerId)
      .then((speaker) => {
        setFormData({
          fullName: speaker.fullName,
          photoUrl: speaker.photoUrl,
          bio: speaker.bio,
          externalLinks: speaker.externalLinks.join(', '),
        });
      })
      .catch((err) => console.error('[v0] Error loading speaker:', err))
      .finally(() => setLoading(false));
  }, [speakerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      await adminSpeakersApi.update(
        speakerId,
        {
          fullName: formData.fullName,
          photoUrl: formData.photoUrl,
          bio: formData.bio,
          externalLinks: formData.externalLinks
            ? formData.externalLinks.split(',').map((l) => l.trim()).filter(Boolean)
            : [],
        },
        token
      );
      router.push('/admin/speakers');
    } catch (err) {
      setError('Erreur lors de la modification');
      console.error('[v0] Error updating speaker:', err);
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
            <Link href="/admin/speakers" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Retour
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Modifier l'intervenant</h1>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la photo
                </label>
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biographie
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liens externes (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="externalLinks"
                  value={formData.externalLinks}
                  onChange={handleChange}
                  placeholder="https://twitter.com/..., https://linkedin.com/in/..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting || !formData.fullName}
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
