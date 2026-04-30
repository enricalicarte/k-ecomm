'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
        // Ignoramos el panel de admin
        if (!pathname.startsWith('/admin')) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
            trackEvent({ type: 'page_view', path: url });
        }
    }
  }, [pathname, searchParams]);

  return null;
}
