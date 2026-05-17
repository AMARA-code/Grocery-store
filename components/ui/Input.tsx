import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, id, label, error, ...props }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition placeholder:text-gray-400",
            "focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/30",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
