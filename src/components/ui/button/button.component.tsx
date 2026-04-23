import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

import { cn } from '@/utils/cn.util';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md';

export type ButtonProps = Omit<HTMLMotionProps<'button'>, 'ref'> & {
  variant?: Variant;
  size?: Size;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide uppercase ' +
  'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink text-surface hover:bg-white shadow-soft',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-raised',
  outline:
    'border border-surface-border text-ink hover:border-ink-muted hover:text-ink bg-surface-muted',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...rest }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...rest}
    />
  ),
);
Button.displayName = 'Button';
