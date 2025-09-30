'use client';
import { Suspense } from 'react';
import { LazyDashboard } from '@/components/lazy-components';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-9 w-1/2" />
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-1/3" /></CardContent>
          </Card>
        ))}
      </div>
      <div>
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
             <Card key={i} className="h-40">
               <CardHeader><Skeleton className="h-6 w-full" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
               <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3 mt-2" /></CardContent>
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <LazyDashboard />
    </Suspense>
  );
}
