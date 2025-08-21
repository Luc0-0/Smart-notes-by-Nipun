'use client';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Header } from '@/components/header';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { useAuth } from '@/lib/firebase/auth-provider';
import { auth } from '@/lib/firebase/config';

async function updateAuthCookies() {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    document.cookie = `firebaseIdToken=${token}; path=/; max-age=3600`;
  } else {
    document.cookie = 'firebaseIdToken=; path=/; max-age=0';
  }
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    const interval = setInterval(updateAuthCookies, 10 * 60 * 1000); // every 10 minutes
    updateAuthCookies();
    return () => clearInterval(interval);
  }, [user]);


  if (loading || !user) {
    // AuthProvider already shows a loading skeleton
    return null;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <SidebarNav />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
      <OnboardingWizard />
    </SidebarProvider>
  );
}
