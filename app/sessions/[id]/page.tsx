'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { sessionsApi } from '@/lib/api/sessions';
import { questionsApi } from '@/lib/api/questions';
import { Session, Question } from '@/lib/types';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { PageTransition } from '@/components/page-transition';

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    sessionsApi
      .get(sessionId)
      .then((data) => {
        setSession(data);
        checkIfLive(data);
        loadQuestions();
      })
      .catch((err) => console.error('[v0] Error loading session:', err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const checkIfLive = (session: Session) => {
    const now = new Date();
    const isSessionLive =
      new Date(session.startTime) <= now && now <= new Date(session.endTime);
    setIsLive(isSessionLive);
  };

  const loadQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const data = await questionsApi.get(sessionId);
      setQuestions(data);
    } catch (err) {
      console.error('[v0] Error loading questions:', err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      setSubmitting(true);
      await questionsApi.ask(
        sessionId,
        newQuestion,
        authorName || 'Anonyme'
      );
      setNewQuestion('');
      setAuthorName('');
      await loadQuestions();
    } catch (err) {
      console.error('[v0] Error asking question:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (questionId: string) => {
    try {
      await questionsApi.upvote(questionId);
      await loadQuestions();
    } catch (err) {
      console.error('[v0] Error upvoting question:', err);
    }
  };

  if (loading) return <SkeletonLoader count={3} />;
  if (!session) return <div className="p-8 text-center text-red-600">Session non trouvée</div>;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <Link href="/" className="mb-4 inline-block text-blue-600 hover:text-blue-800">
              ← Retour
            </Link>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {session.title}
                  </h1>
                  {isLive && (
                    <motion.div
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600"
                    >
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      En direct
                    </motion.div>
                  )}
                </div>
              </div>

              <p className="mt-4 text-gray-600">{session.description}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">HORAIRE</p>
                  <p className="mt-1 text-gray-900">
                    {new Date(session.startTime).toLocaleTimeString('fr-FR')} -{' '}
                    {new Date(session.endTime).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">SALLE</p>
                  <p className="mt-1 text-gray-900">{session.room.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">CAPACITÉ</p>
                  <p className="mt-1 text-gray-900">{session.capacity}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Speakers */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="mb-4 text-xl font-bold text-gray-900">Intervenants</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {session.speakers.map((speaker) => (
                <Link key={speaker.id} href={`/speakers/${speaker.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-semibold text-gray-900">
                      {speaker.fullName}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Q&A Section */}
          {isLive && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border border-blue-200 bg-blue-50 p-6"
            >
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Poser une question
              </h2>
              <form onSubmit={handleAskQuestion} className="space-y-4">
                <div>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Votre question..."
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Votre nom (optionnel, anonyme par défaut)"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !newQuestion.trim()}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
            </motion.section>
          )}

          {/* Questions list */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Questions ({questions.length})
            </h2>
            {questionsLoading ? (
              <SkeletonLoader count={3} type="card" />
            ) : questions.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-gray-600">
                  {isLive
                    ? 'Aucune question pour le moment'
                    : 'Les questions seront disponibles quand la session sera en direct'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">
                          {question.authorName}
                        </p>
                        <p className="mt-2 text-gray-900">{question.content}</p>
                      </div>
                      <button
                        onClick={() => handleUpvote(question.id)}
                        className="ml-4 flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-colors whitespace-nowrap"
                      >
                        👍 {question.upvoteCount}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </main>
      </div>
    </PageTransition>
  );
}
