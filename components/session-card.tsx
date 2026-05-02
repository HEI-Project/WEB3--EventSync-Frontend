'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SessionLite } from '@/lib/types';

interface SessionCardProps {
  session: SessionLite;
  isLive?: boolean;
  onAddFavorite?: (id: string) => void;
  isFavorite?: boolean;
  index?: number;
}

export function SessionCard({
  session,
  isLive = false,
  onAddFavorite,
  isFavorite = false,
  index = 0,
}: SessionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Link href={`/sessions/${session.id}`}>
        <motion.div
          animate={{ scale: isHovered ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header with live badge */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {session.title}
              </h3>
            </div>
            {isLive && (
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-2 flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 whitespace-nowrap"
              >
                <div className="h-2 w-2 rounded-full bg-red-500" />
                Live
              </motion.div>
            )}
          </div>

          {/* Time and room */}
          <div className="mb-4 space-y-1 text-sm text-gray-600">
            <p>
              {formatTime(startTime)} - {formatTime(endTime)}
            </p>
            <p className="font-medium text-gray-700">{session.room.name}</p>
          </div>

          {/* Speakers */}
          <div className="mb-4 flex-1">
            <p className="text-xs font-medium text-gray-500 mb-2">
              INTERVENANTS
            </p>
            <div className="flex flex-wrap gap-1">
              {session.speakers.slice(0, 2).map((speaker) => (
                <span
                  key={speaker.id}
                  className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                >
                  {speaker.fullName}
                </span>
              ))}
              {session.speakers.length > 2 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  +{session.speakers.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Favorite button */}
          {onAddFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddFavorite(session.id);
              }}
              className={`self-start text-sm font-medium transition-colors ${
                isFavorite
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-gray-400 hover:text-amber-500'
              }`}
            >
              {isFavorite ? '★' : '☆'} Favori
            </button>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
