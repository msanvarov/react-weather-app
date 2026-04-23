import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

import { cn } from '@/utils/cn.util';

export type CardProps = HTMLMotionProps<'div'>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...rest }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-3xl border border-surface-border bg-surface-muted/80 backdrop-blur-sm ' +
          'shadow-card',
        className,
      )}
      {...rest}
    />
  ),
);
Card.displayName = 'Card';
