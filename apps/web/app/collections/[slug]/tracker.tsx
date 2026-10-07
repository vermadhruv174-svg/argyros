'use client';

import { useEffect } from 'react';

export default function CollectionTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Generate or get sessionId
    let sessionId = localStorage.getItem('session_id') || '';
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('session_id', sessionId);
    }

    // Call API (fire and forget)
    fetch(`http://localhost:4000/api/collections/${slug}`, {
      headers: {
        'x-session-id': sessionId,
      },
    }).catch(() => {});
  }, [slug]);

  return null;
}
