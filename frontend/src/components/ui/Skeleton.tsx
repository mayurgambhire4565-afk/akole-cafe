import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={twMerge('skeleton', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-24" />
      <div className="flex gap-3 pt-1">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function DashboardStatSkeleton({ count = 4 }: SkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}
