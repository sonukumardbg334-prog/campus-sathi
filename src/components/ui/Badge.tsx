import React from 'react';
import { ComplaintStatus, PriorityLevel } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    danger: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    info: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    teal: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60',
    outline: 'border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 bg-transparent',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  switch (status) {
    case 'SUBMITTED':
      return <Badge variant="info">Submitted</Badge>;
    case 'UNDER_REVIEW':
      return <Badge variant="warning">Under Review</Badge>;
    case 'ASSIGNED':
      return <Badge variant="info">Assigned</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="warning">In Progress</Badge>;
    case 'AWAITING_VERIFICATION':
      return <Badge variant="teal">Awaiting Verification</Badge>;
    case 'RESOLVED':
      return <Badge variant="success">Resolved</Badge>;
    case 'REOPENED':
      return <Badge variant="danger">Reopened</Badge>;
    case 'REJECTED':
      return <Badge variant="danger">Rejected</Badge>;
    case 'CANCELLED':
      return <Badge variant="default">Cancelled</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  switch (priority) {
    case 'URGENT':
      return <Badge variant="danger">Urgent</Badge>;
    case 'HIGH':
      return <Badge variant="warning">High Priority</Badge>;
    case 'MEDIUM':
      return <Badge variant="info">Medium</Badge>;
    case 'LOW':
      return <Badge variant="default">Low</Badge>;
    default:
      return <Badge variant="default">{priority}</Badge>;
  }
};

