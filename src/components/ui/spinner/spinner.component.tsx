import { motion } from 'framer-motion';

import { cn } from '@/utils/cn.util';

export type SpinnerProps = {
  size?: number;
  className?: string;
  label?: string;
};

export const Spinner = ({ size = 18, className, label }: SpinnerProps) => (
  <span
    role="status"
    aria-live="polite"
    className={cn('inline-flex items-center gap-2 text-ink-muted', className)}
  >
    <motion.span
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      className="inline-block rounded-full border-2 border-surface-border border-t-ink"
      style={{ width: size, height: size }}
    />
    {label && <span className="text-xs uppercase tracking-wider">{label}</span>}
  </span>
);
