import React, { useState, useLayoutEffect, useRef, useMemo } from "react";
import { debounce } from "lodash";
import { Search, Loader2 } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/components/select/Select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

type SelectContextType = {
  value?: string | null;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement>;
};

const SelectContext = React.createContext<SelectContextType>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

interface SearchableSelectProps {
  name?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string | null;
  onValueChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  options: SelectOption[];
  loading: boolean;
  searchFn: (query: string) => void;
  minSearchLength?: number;
  className?: string;
  triggerClassName?: string;
}

export const SearchableSelect = React.memo(
  ({
    name,
    label,
    required = false,
    placeholder = "Search...",
    value,
    onValueChange,
    error,
    disabled = false,
    options,
    loading,
    searchFn,
    minSearchLength = 3,
    className,
    triggerClassName,
  }: SearchableSelectProps) => {
    const [query, setQuery] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const mergedOptions = useMemo(() => {
      if (value) {
        const option = options.find((o) => o.value === value);
        if (option) {
          return [option, ...options.filter((o) => o.value !== value)];
        }
      }
      return options;
    }, [value, options]);

    const debouncedSearch = useMemo(
      () =>
        debounce((searchQuery: string) => {
          if (searchQuery === "" || searchQuery.length >= minSearchLength) {
            searchFn(searchQuery);
          }
        }, 300),
      [minSearchLength, searchFn]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      setInputValue(newQuery);
      debouncedSearch(newQuery);
    };

    const displayedOptions =
      query === "" ? mergedOptions.slice(0, 8) : mergedOptions;

    const highlightMatch = (text: string, query: string) => {
      if (!query.trim()) return text;
      const regex = new RegExp(
        `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      );
      const parts = text.split(regex);
      return (
        <>
          {parts.map((part, i) =>
            regex.test(part) ? (
              <span
                key={i}
                className="bg-primary-500/20 text-primary-500 font-medium"
              >
                {part}
              </span>
            ) : (
              part
            )
          )}
        </>
      );
    };

    const handleSelectItem = (value: string) => {
      if (onValueChange) {
        onValueChange(value);
      }
      setOpen(false);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleTriggerClick = () => {
      if (!disabled) {
        setOpen(!open);
      }
    };

    return (
      <SelectContext.Provider
        value={{ value, onValueChange, open, setOpen, triggerRef }}
      >
        <div className={cn("space-y-2", className)}>
          {label && (
            <Label
              htmlFor={name}
              className={cn(
                "text-sm leading-none text-mkneutral-700 font-medium"
              )}
            >
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
          )}

          <div className="relative">
            <SelectTrigger
              ref={triggerRef}
              className={cn(
                "form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm",
                error
                  ? "border-red-500 ring-1 ring-red-500 border-destructive ring-destructive"
                  : "",
                disabled ? "opacity-50 cursor-not-allowed" : "",
                triggerClassName
              )}
              onClick={handleTriggerClick}
              disabled={disabled}
              aria-label={label}
            >
              <SelectValue
                placeholder={placeholder}
                options={displayedOptions}
              />
            </SelectTrigger>

            {open && (
              <div
                ref={dropdownRef}
                className="absolute z-50 w-full mt-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-md animate-in fade-in-80"
                onClick={(e) => e.stopPropagation()}
              >
                <SearchInput
                  inputRef={inputRef}
                  inputValue={inputValue}
                  handleSearchChange={handleSearchChange}
                />

                <ScrollArea className="max-h-60 overflow-y-auto">
                  <div className="p-1">
                    {loading ? (
                      <div className="py-6 text-center">
                        <Loader2 className="h-5 w-5 mx-auto animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Searching...
                        </p>
                      </div>
                    ) : query.length > 0 && query.length < minSearchLength ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Type at least {minSearchLength} characters to search
                      </div>
                    ) : displayedOptions.length > 0 ? (
                      displayedOptions.map((option) => (
                        <div
                          key={option.value.toString()}
                          className={cn(
                            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                            value === option.value.toString()
                              ? "bg-primary-500/10 text-primary-500 font-medium"
                              : "hover:bg-slate-100"
                          )}
                          onClick={() =>
                            handleSelectItem(option.value.toString())
                          }
                        >
                          {value === option.value.toString() && (
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                              <svg
                                className="h-4 w-4"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          )}
                          {value === option.value.toString()
                            ? option.label
                            : highlightMatch(option.label, query)}
                        </div>
                      ))
                    ) : query.length >= minSearchLength ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No results found
                      </div>
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Start typing to search
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </SelectContext.Provider>
    );
  }
);

export default SearchableSelect;

interface SearchInputProps {
  inputValue: string;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = React.memo(function SearchInput(props: SearchInputProps) {
  useLayoutEffect(() => {
    if (props.inputRef.current) {
      props.inputRef.current.focus();
    }
  }, [props.inputRef]);

  return (
    <div className="p-2 border-b">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={props.inputRef}
          type="text"
          className="w-full bg-transparent py-1.5 pl-8 pr-2 text-sm outline-none border-none focus:ring-0"
          placeholder="Type to search..."
          value={props.inputValue}
          onChange={props.handleSearchChange}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
});

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
>(({ className, children, ...props }, ref) => {
  const { open, setOpen, value, triggerRef } = React.useContext(SelectContext);
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    if (!props.disabled) {
      setOpen(!open);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (props.disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setOpen(!open);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  const setRefs = (el: HTMLButtonElement | null) => {
    if (typeof ref === "function") {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }

    if (el !== null && triggerRef.current !== el) {
      Object.defineProperty(triggerRef, "current", {
        value: el,
        writable: true,
        configurable: true,
      });
    }
  };

  return (
    <button
      ref={setRefs}
      type="button"
      className={cn(
        "custom-select-trigger flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
        props.disabled && "opacity-50 cursor-not-allowed",
        isFocused && "border-primary-500 ring-2 ring-primary-500/20",
        open && "border-primary-500 ring-2 ring-primary-500/20",
        className
      )}
      aria-expanded={open}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-haspopup="listbox"
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          open && "transform rotate-180"
        )}
      />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = ({
  placeholder,
  options,
}: {
  placeholder?: string;
  options: SelectOption[];
}) => {
  const { value } = React.useContext(SelectContext);

  const displayLabel =
    options?.find((option) => option.value === value)?.label ?? placeholder;

  return (
    <span className={cn("truncate", !value && "text-muted-foreground")}>
      {displayLabel}
    </span>
  );
};
SelectValue.displayName = "SelectValue";
