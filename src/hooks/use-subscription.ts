
'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/auth-provider';

type Subscription = {
  role: 'free' | 'pro';
  status: string;
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const subscriptionRef = doc(db, 'customers', user.uid, 'subscriptions', 'sub');
    
    const unsubscribe = onSnapshot(subscriptionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSubscription({
          role: data.role,
          status: data.status,
        });
      } else {
        setSubscription({ role: 'free', status: 'active' });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching subscription:', error);
      setSubscription({ role: 'free', status: 'active' }); // Default to free on error
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { subscription, loading };
}
