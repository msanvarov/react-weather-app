import { cn } from '@/utils/cn.util';

type Tone = 'neutral' | 'error';

export type StatusMessageProps = {
  title: string;
  description?: string;
  tone?: Tone;
  className?: string;
};

const toneClasses: Record<Tone, string> = {
  neutral: 'text-ink-muted',
  error: 'text-red-300',
};

export const StatusMessage = ({
  title,
  description,
  tone = 'neutral',
  className,
}: StatusMessageProps) => (
  <div
    role={tone === 'error' ? 'alert' : 'status'}
    className={cn(
      'rounded-2xl border border-surface-border bg-surface-muted/60 px-5 py-4',
      toneClasses[tone],
      className,
    )}
  >
    <p className="text-sm font-medium text-ink">{title}</p>
    {description && (
      <p className="mt-1 text-xs leading-relaxed text-ink-faint">
        {description}
      </p>
    )}
  </div>
);
