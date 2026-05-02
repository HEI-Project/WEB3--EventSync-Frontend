'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    // Allow login page without authentication
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    // Require token for other admin pages
    if (!token) {
      router.push('/admin/login');
    } else {
      setLoading(false);
    }
  }, [router, pathname]);

  if (loading && pathname !== '/admin/login') {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return <>{children}</>;
}
