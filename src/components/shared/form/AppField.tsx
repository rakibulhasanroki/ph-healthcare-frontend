import { Label } from "@/components/ui/label";
import { AnyFieldApi } from "@tanstack/react-form";
import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return String(error);
};

type AppFieldProps = {
  field: AnyFieldApi;
  label: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  className?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  disabled?: boolean;
};

const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  className,
  append,
  prepend,
  disabled,
}: AppFieldProps) => {
  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null;

  const hasError = firstError !== null;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={field.name}
        className={cn(hasError && "text-destructive")}
      >
        {label}
      </Label>
      <div className="relative">
        {prepend && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
            {prepend}
          </div>
        )}

        <Input
          id={field.name}
          name={field.name}
          type={type}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          className={cn(
            prepend && "pl-10",
            append && "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive/20",
          )}
        />

        {append && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
            {append}
          </div>
        )}
      </div>

      {/* ⭐ error OUTSIDE */}
      {hasError && (
        <p id={`${field.name}-error`} className="text-xs text-destructive mt-1">
          {firstError}
        </p>
      )}
    </div>
  );
};

export default AppField;
