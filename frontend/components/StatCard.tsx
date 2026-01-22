'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color = 'green', subtitle }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
