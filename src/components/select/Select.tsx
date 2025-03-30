import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

type SelectProps = {
  value?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  name?: string;
  options?: SelectOption[];
  children?: React.ReactNode;
};

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

export const Select = ({
  value,
  onValueChange,
  placeholder,
  disabled = false,
  className,
  error,
  label,
  required = false,
  name,
  options,
  children,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <SelectContext.Provider
      value={{ value, onValueChange, open, setOpen, triggerRef }}
    >
      <div className={cn("space-y-2 w-full", className)}>
        <BaseSelect
          name={name}
          value={value}
          onValueChange={(value) => onValueChange(value)}
          disabled={disabled}
        >
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

          {!children ? (
            <>
              <SelectTrigger
                className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm w-full ${
                  error ? " border-red-500 ring-1  ring-red-500" : ""
                }`}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.length === 0 && (
                  <li className="py-6 text-center text-sm text-muted-foreground">
                    No options available
                  </li>
                )}

                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </>
          ) : (
            children
          )}

          {error && (
            <p className="form-error text-sm text-destructive flex items-center">
              <AlertCircle size={12} className="mr-1" /> {error}
            </p>
          )}
        </BaseSelect>
      </div>
    </SelectContext.Provider>
  );
};

// export const SelectTrigger = React.forwardRef<
//   HTMLButtonElement,
//   React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
// >(({ className, children, ...props }, ref) => {
//   const { open, setOpen, value, triggerRef } = React.useContext(SelectContext);
//   const [isFocused, setIsFocused] = useState(false);

//   const handleClick = () => {
//     if (!props.disabled) {
//       setOpen(!open);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (props.disabled) return;

//     switch (e.key) {
//       case "Enter":
//       case " ":
//         e.preventDefault();
//         setOpen(!open);
//         break;
//       case "ArrowDown":
//         e.preventDefault();
//         if (!open) {
//           setOpen(true);
//         }
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         break;
//       case "Escape":
//         setOpen(false);
//         break;
//     }
//   };

//   const setRefs = (el: HTMLButtonElement | null) => {
//     if (typeof ref === "function") {
//       ref(el);
//     } else if (ref) {
//       ref.current = el;
//     }

//     if (el !== null && triggerRef.current !== el) {
//       Object.defineProperty(triggerRef, "current", {
//         value: el,
//         writable: true,
//         configurable: true,
//       });
//     }
//   };

//   return (
//     <button
//       ref={setRefs}
//       type="button"
//       className={cn(
//         "custom-select-trigger flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
//         props.disabled && "opacity-50 cursor-not-allowed",
//         isFocused && "border-primary-500 ring-2 ring-primary-500/20",
//         open && "border-primary-500 ring-2 ring-primary-500/20",
//         className
//       )}
//       aria-expanded={open}
//       onClick={handleClick}
//       onKeyDown={handleKeyDown}
//       onFocus={() => setIsFocused(true)}
//       onBlur={() => setIsFocused(false)}
//       aria-haspopup="listbox"
//       {...props}
//     >
//       {children}
//       <ChevronDown
//         className={cn(
//           "h-4 w-4 opacity-50 transition-transform duration-200",
//           open && "transform rotate-180"
//         )}
//       />
//     </button>
//   );
// });
// SelectTrigger.displayName = "SelectTrigger";

// export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
//   const { value } = React.useContext(SelectContext);

//   return (
//     <span className={cn("truncate", !value && "text-muted-foreground")}>
//       {value || placeholder}
//     </span>
//   );
// };
// SelectValue.displayName = "SelectValue";

// export const SelectContent = ({ children }: { children: React.ReactNode }) => {
//   const { open, setOpen, triggerRef } = React.useContext(SelectContext);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node) &&
//         triggerRef.current &&
//         !triggerRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     if (open) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [open, setOpen, triggerRef]);

//   if (!open) return null;

//   return (
//     <div className="relative z-50">
//       <div
//         ref={containerRef}
//         className="custom-select-content absolute mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover shadow-md animate-scale-in"
//       >
//         <div className="max-h-60 overflow-auto p-1">{children}</div>
//       </div>
//     </div>
//   );
// };
// SelectContent.displayName = "SelectContent";

// export const SelectItem = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }
// >(({ className, children, value, disabled, ...props }, ref) => {
//   const {
//     value: selectedValue,
//     onValueChange,
//     setOpen,
//   } = React.useContext(SelectContext);

//   const isSelected = selectedValue === value;

//   const handleSelect = () => {
//     if (disabled) return;
//     onValueChange?.(value);
//     setOpen(false);
//   };

//   return (
//     <div
//       ref={ref}
//       role="option"
//       aria-selected={isSelected}
//       data-state={isSelected ? "checked" : "unchecked"}
//       data-disabled={disabled}
//       className={cn(
//         "custom-select-item relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//         isSelected && "bg-primary-500/10 text-primary-500 font-medium",
//         disabled && "opacity-50 cursor-not-allowed",
//         className
//       )}
//       onClick={handleSelect}
//       {...props}
//     >
//       {children}
//       {isSelected && (
//         <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//           <svg
//             width="15"
//             height="15"
//             viewBox="0 0 15 15"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 text-primary-500"
//           >
//             <path
//               d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
//               fill="currentColor"
//               fillRule="evenodd"
//               clipRule="evenodd"
//             ></path>
//           </svg>
//         </span>
//       )}
//     </div>
//   );
// });
// SelectItem.displayName = "SelectItem";

// export const LegacySelect = ({
//   options,
//   value,
//   onChange,
//   placeholder = "Select an option",
//   disabled = false,
//   className = "",
//   error,
//   label,
//   required = false,
//   name,
// }: {
//   options: SelectOption[];
//   value?: SelectOption | null;
//   onChange?: (value: SelectOption | null) => void;
//   placeholder?: string;
//   disabled?: boolean;
//   className?: string;
//   error?: string;
//   label?: string;
//   required?: boolean;
//   name?: string;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const triggerRef = useRef<HTMLButtonElement>(null);

//   const handleSelect = (option: SelectOption) => {
//     if (option.disabled) return;

//     onChange?.(option);
//     setIsOpen(false);
//     triggerRef.current?.focus();
//   };

//   const handleTriggerClick = () => {
//     if (!disabled) {
//       setIsOpen(!isOpen);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (disabled) return;

//     switch (e.key) {
//       case "Enter":
//       case " ":
//         e.preventDefault();
//         setIsOpen(!isOpen);
//         break;
//       case "ArrowDown":
//         e.preventDefault();
//         if (!isOpen) {
//           setIsOpen(true);
//         }
//         break;
//       case "ArrowUp":
//         e.preventDefault();
//         break;
//       case "Escape":
//         setIsOpen(false);
//         break;
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   const selectedLabel = value ? value.label : placeholder;

//   return (
//     <div className="space-y-1.5">
//       {label && (
//         <label
//           className={cn(
//             "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
//             required &&
//               "after:content-['*'] after:ml-0.5 after:text-destructive"
//           )}
//           htmlFor={name}
//         >
//           {label}
//         </label>
//       )}

//       <div
//         ref={containerRef}
//         className={cn("custom-select-container", className)}
//       >
//         <button
//           ref={triggerRef}
//           type="button"
//           id={name}
//           name={name}
//           className={cn(
//             "custom-select-trigger",
//             disabled && "opacity-50 cursor-not-allowed",
//             isFocused && "border-primary-500 ring-2 ring-primary-500/20",
//             error && "border-destructive"
//           )}
//           aria-expanded={isOpen}
//           disabled={disabled}
//           onClick={handleTriggerClick}
//           onKeyDown={handleKeyDown}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           aria-haspopup="listbox"
//         >
//           <span className={cn("truncate", !value && "text-muted-foreground")}>
//             {selectedLabel}
//           </span>
//           <ChevronDown
//             className={cn(
//               "h-4 w-4 opacity-50 transition-transform duration-200",
//               isOpen && "transform rotate-180"
//             )}
//           />
//         </button>

//         {isOpen && (
//           <div className="custom-select-content animate-slide-down">
//             <ul className="max-h-60 overflow-auto p-1" role="listbox">
//               {options.map((option) => (
//                 <li
//                   key={option.value}
//                   role="option"
//                   aria-selected={value?.value === option.value}
//                   data-state={
//                     value?.value === option.value ? "checked" : "unchecked"
//                   }
//                   data-disabled={option.disabled}
//                   className={cn(
//                     "custom-select-item",
//                     option.disabled && "opacity-50 cursor-not-allowed",
//                     value?.value === option.value &&
//                       "font-medium text-primary-500"
//                   )}
//                   onClick={() => handleSelect(option)}
//                 >
//                   <span className="flex-grow truncate">{option.label}</span>
//                   {value?.value === option.value && (
//                     <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
//                       <svg
//                         width="15"
//                         height="15"
//                         viewBox="0 0 15 15"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4 text-primary-500"
//                       >
//                         <path
//                           d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
//                           fill="currentColor"
//                           fillRule="evenodd"
//                           clipRule="evenodd"
//                         ></path>
//                       </svg>
//                     </span>
//                   )}
//                 </li>
//               ))}
//               {options.length === 0 && (
//                 <li className="py-6 text-center text-sm text-muted-foreground">
//                   No options available
//                 </li>
//               )}
//             </ul>
//           </div>
//         )}
//       </div>

//       {error && <p className="text-sm text-destructive mt-1">{error}</p>}
//     </div>
//   );
// };

// export default LegacySelect;
