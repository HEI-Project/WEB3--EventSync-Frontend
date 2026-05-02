'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  backLabel?: string;
  action?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  backLink,
  backLabel = '← Retour',
  action,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {backLink && (
          <Link href={backLink} className="mb-4 inline-block text-blue-600 hover:text-blue-800">
            {backLabel}
          </Link>
        )}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between gap-4"
        >
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </motion.div>
      </div>
    </header>
  );
}
