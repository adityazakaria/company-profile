import { forwardRef, useId } from 'react';
import { cn } from '../../lib/utils';

const base =
  'block w-full rounded-lg border bg-white px-3.5 text-sm text-navy placeholder:text-navy/40 transition-colors ' +
  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-surface';

export function Field({ id, label, error, hint, required, children, className }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy">
          {label} {required && <span className="text-primary-dark" aria-hidden>*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-navy-muted">{hint}</p>}
      {error && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export const Input = forwardRef(function Input({ label, error, hint, required, className, wrapperClassName, ...props }, ref) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      <input
        ref={ref} id={id} aria-invalid={!!error}
        className={cn(base, 'h-11', error ? 'border-red-500' : 'border-navy/20', className)}
        {...props}
      />
    </Field>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, hint, required, className, wrapperClassName, rows = 4, ...props }, ref) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      <textarea
        ref={ref} id={id} rows={rows} aria-invalid={!!error}
        className={cn(base, 'py-2.5', error ? 'border-red-500' : 'border-navy/20', className)}
        {...props}
      />
    </Field>
  );
});

export const Select = forwardRef(function Select({ label, error, hint, required, className, wrapperClassName, children, ...props }, ref) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      <select
        ref={ref} id={id} aria-invalid={!!error}
        className={cn(base, 'h-11', error ? 'border-red-500' : 'border-navy/20', className)}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
});

export const Checkbox = forwardRef(function Checkbox({ label, className, ...props }, ref) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn('inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium', className)}>
      <input ref={ref} id={id} type="checkbox" className="h-4.5 h-[18px] w-[18px] rounded border-navy/30 accent-primary" {...props} />
      {label}
    </label>
  );
});
