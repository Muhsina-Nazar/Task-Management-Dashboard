'use strict';

import React from 'react';
import { Task } from '@/types';
import { CheckCircle2, ClipboardList, Clock, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsSummaryProps {
  tasks: Task[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ tasks }) => {
  const totalCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'Todo').length;
  const progressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const statCards = [
    {
      title: 'Total Tasks',
      value: totalCount,
      icon: ClipboardList,
      colorClass: 'text-primary bg-primary/10 border-primary/20',
      gradient: 'from-primary/5 to-blue-500/5',
    },
    {
      title: 'Todo Tasks',
      value: todoCount,
      icon: ListTodo,
      colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      gradient: 'from-blue-500/5 to-cyan-500/5',
    },
    {
      title: 'In Progress',
      value: progressCount,
      icon: Clock,
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      gradient: 'from-amber-500/5 to-orange-500/5',
    },
    {
      title: 'Completed',
      value: completedCount,
      icon: CheckCircle2,
      colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      gradient: 'from-emerald-500/5 to-teal-500/5',
    },
  ];

  return (
    <div className="space-y-6">

      {/* 4-Card Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={cn(
              'relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5'
            )}
          >
            {/* Soft gradient background */}
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50 dark:opacity-30 pointer-events-none', card.gradient)}></div>

            <div className="relative flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                {card.title}
              </span>
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg border', card.colorClass)}>
                <card.icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="relative mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight font-sans">
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Completion Progress Bar */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Dashboard Progress</span>
            <span className="text-xs text-muted-foreground mt-0.5">Overall Completion Progress</span>
          </div>
          <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            {completionRate}% Complete
          </span>
        </div>
        {/* Track */}
        <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden border border-border/50">
          {/* Indicator */}
          <div
            style={{ width: `${completionRate}%` }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-700 ease-out shadow-sm"
          ></div>
        </div>
        {/* Step labels */}
        <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

    </div>
  );
};
