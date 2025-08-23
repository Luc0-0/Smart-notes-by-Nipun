
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-provider';

type Subscription = {
  role: 'free' | 'pro';
  status: string;
};

// Mock subscription hook since billing is temporarily removed.
// This defaults all users to "pro" so that AI features are not blocked.
export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setSubscription({ role: 'pro', status: 'active' });
    } else {
      setSubscription(null);
    }
    setLoading(false);
  }, [user]);

  return { subscription, loading };
}
