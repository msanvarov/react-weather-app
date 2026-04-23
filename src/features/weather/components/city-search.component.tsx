import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { Spinner } from "@/components/ui/spinner/spinner.component";
import { SUGGESTED_CITIES } from "@/config/cities.config";
import {
  MIN_QUERY_LENGTH,
  useCitySearch,
} from "@/features/weather/hooks/use-city-search.hook";
import {
  cityKey,
  cityLabel,
  type CityLocation,
} from "@/features/weather/types/city.types";
import { useDebouncedValue } from "@/hooks/use-debounced-value.hook";
import { cn } from "@/utils/cn.util";

export type CitySearchProps = {
  value: CityLocation | null;
  onChange: (city: CityLocation) => void;
};

const DEBOUNCE_MS = 250;

type DisplayMode = "suggestions" | "results";

export const CitySearch = ({ value, onChange }: CitySearchProps) => {
  const inputId = useId();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const searchActive = debouncedQuery.trim().length >= MIN_QUERY_LENGTH;
  const {
    data: searchResults,
    isFetching,
    isError,
  } = useCitySearch(debouncedQuery);

  const mode: DisplayMode = searchActive ? "results" : "suggestions";
  const options = useMemo<readonly CityLocation[]>(() => {
    if (mode === "suggestions") return SUGGESTED_CITIES;
    return searchResults ?? [];
  }, [mode, searchResults]);

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(0);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, [open, close]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [options]);

  const commit = (index: number) => {
    const city = options[index];
    if (!city) return;
    onChange(city);
    setQuery(cityLabel(city));
    close();
    inputRef.current?.blur();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((prev) =>
        options.length === 0 ? 0 : (prev + 1) % options.length,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((prev) =>
        options.length === 0 ? 0 : prev <= 0 ? options.length - 1 : prev - 1,
      );
    } else if (event.key === "Enter") {
      if (!open || options.length === 0) return;
      event.preventDefault();
      commit(highlightedIndex);
    } else if (event.key === "Escape") {
      close();
    }
  };

  const selectedLabel = value ? cityLabel(value) : "";
  const hasChanges = query !== selectedLabel;
  const showEmptyState =
    mode === "results" && !isFetching && (searchResults?.length ?? 0) === 0;

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={inputId}
        className="block text-xs font-medium uppercase tracking-[0.18em] text-ink-faint"
      >
        City
      </label>
      <div className="relative mt-2">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-activedescendant={
            open && options[highlightedIndex]
              ? `${listboxId}-${highlightedIndex}`
              : undefined
          }
          spellCheck={false}
          autoComplete="off"
          placeholder="Search for any city…"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={cn(
            "h-12 w-full rounded-xl border bg-surface-muted pl-11 pr-11 text-base outline-none",
            "border-surface-border text-ink placeholder:text-ink-faint",
            "transition-colors duration-200 hover:border-ink-muted/60",
            "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          )}
        />
        {isFetching && mode === "results" && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <Spinner size={14} />
          </span>
        )}
        {!isFetching && query.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setOpen(true);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-surface-border hover:text-ink"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M2 2l8 8M10 2l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-surface-border bg-surface-raised p-1 shadow-card"
          >
            <ListboxHeading mode={mode} hasQuery={query.trim().length > 0} />

            <ul
              id={listboxId}
              role="listbox"
              aria-label="Cities"
              className="max-h-[288px] overflow-y-auto"
            >
              {isError && mode === "results" && (
                <li className="px-4 py-3 text-sm text-red-300">
                  Couldn't search — please try again.
                </li>
              )}

              {showEmptyState && (
                <li className="px-4 py-6 text-center text-sm text-ink-faint">
                  No cities match "{debouncedQuery}".
                </li>
              )}

              {options.map((city, index) => {
                const isHighlighted = open && index === highlightedIndex;
                const isSelected = value
                  ? cityKey(value) === cityKey(city)
                  : false;
                return (
                  <li
                    key={cityKey(city)}
                    id={`${listboxId}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => commit(index)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm",
                      "text-ink-muted",
                      isHighlighted && "bg-surface-border text-ink",
                      isSelected && !isHighlighted && "text-ink",
                    )}
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="text-ink">{city.name}</span>
                      {city.state && (
                        <span className="text-xs text-ink-faint">
                          {city.state}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-ink-faint">
                      {city.country}
                    </span>
                  </li>
                );
              })}

              {mode === "results" &&
                !searchActive &&
                query.trim().length > 0 &&
                hasChanges && (
                  <li className="px-4 py-3 text-xs text-ink-faint">
                    Keep typing…
                  </li>
                )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ListboxHeading = ({
  mode,
  hasQuery,
}: {
  mode: DisplayMode;
  hasQuery: boolean;
}) => {
  const label =
    mode === "suggestions" ? "Suggested cities" : hasQuery ? "Results" : "";
  if (!label) return null;
  return (
    <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
      {label}
    </p>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    aria-hidden="true"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      d="M7 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM11 11l3 3"
    />
  </svg>
);
