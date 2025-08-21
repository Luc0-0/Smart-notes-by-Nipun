
'use client';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Header } from '@/components/header';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { useAuth } from '@/lib/firebase/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <SidebarNav />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 sm:p-6">
            {loading || !user ? (
               <div className="space-y-8">
                <div>
                  <Skeleton className="h-9 w-1/2" />
                  <Skeleton className="h-5 w-1/3 mt-2" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                     <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-3/4 mt-2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-2/3 mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
      <OnboardingWizard />
    </SidebarProvider>
  );
}
