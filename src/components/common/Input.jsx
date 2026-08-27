import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, icon: Icon, error, rightElement, className = "", ...rest },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? "pl-10" : ""} ${rightElement ? "pr-10" : ""} ${
            error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""
          } ${className}`}
          {...rest}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
