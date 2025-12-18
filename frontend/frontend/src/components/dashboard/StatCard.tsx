import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  loading?: boolean;
  alert?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  loading = false,
  alert = false,
  action,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('bg-zinc-950 border-zinc-800', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            {title}
          </CardTitle>
          {icon && <div className="h-4 w-4 text-zinc-500">{icon}</div>}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 bg-zinc-800 mb-1" />
          <Skeleton className="h-3 w-32 bg-zinc-800" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'bg-zinc-950 border-zinc-800 transition-all hover:border-zinc-700',
        alert && 'border-red-900/50 bg-red-950/10',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-zinc-500">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold text-zinc-100", alert && "text-red-400")}>{value}</div>
        {(description || trend) && (
          <div className="flex items-center text-xs text-zinc-500 mt-1">
            {trend && (
              <span
                className={cn(
                  'flex items-center mr-2',
                  trend.direction === 'up'
                    ? 'text-green-500'
                    : trend.direction === 'down'
                      ? 'text-red-500'
                      : 'text-zinc-500'
                )}
              >
                {trend.direction === 'up' ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : trend.direction === 'down' ? (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                ) : null}
                {trend.value}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
        {action && <div className="mt-3">{action}</div>}
      </CardContent>
    </Card>
  );
}
