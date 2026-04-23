import { AnimatePresence, motion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '@/utils/cn.util';

export type SelectOption<TValue extends string | number> = {
  readonly value: TValue;
  readonly label: string;
  readonly hint?: string;
};

export type SelectProps<TValue extends string | number> = {
  label: string;
  placeholder?: string;
  value: TValue | null;
  options: readonly SelectOption<TValue>[];
  onChange: (value: TValue) => void;
  className?: string;
  emptyLabel?: string;
};

export const Select = <TValue extends string | number>({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onChange,
  className,
  emptyLabel = 'No options',
}: SelectProps<TValue>) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value],
  );

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const openMenu = () => {
    setOpen(true);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close();
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open ? commit(highlightedIndex) : openMenu();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % options.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev <= 0 ? options.length - 1 : prev - 1,
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      commit(highlightedIndex);
    } else if (event.key === 'Tab') {
      close();
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-[0.18em] text-ink-faint"
      >
        {label}
      </label>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'mt-2 flex h-12 w-full items-center justify-between rounded-xl border px-4 text-left ' +
            'transition-colors duration-200 outline-none',
          'border-surface-border bg-surface-muted hover:border-ink-muted/60',
          'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        )}
      >
        <span
          className={cn(
            'truncate text-base',
            selectedOption ? 'text-ink' : 'text-ink-faint',
          )}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className={cn(
            'ml-3 shrink-0 text-ink-faint transition-transform duration-200',
            open && 'rotate-180',
          )}
        >
          <path
            fill="currentColor"
            d="M3.22 5.97a.75.75 0 0 1 1.06 0L8 9.69l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L3.22 7.03a.75.75 0 0 1 0-1.06Z"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            tabIndex={-1}
            onKeyDown={onListKeyDown}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn(
              'absolute z-20 mt-2 w-full overflow-hidden rounded-xl border ' +
                'border-surface-border bg-surface-raised p-1 shadow-card',
            )}
          >
            {options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-ink-faint">{emptyLabel}</li>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;
                return (
                  <li
                    key={String(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => commit(index)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm',
                      'text-ink-muted',
                      isHighlighted && 'bg-surface-border text-ink',
                      isSelected && 'text-ink',
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.hint && (
                      <span className="ml-3 text-xs text-ink-faint">
                        {option.hint}
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
