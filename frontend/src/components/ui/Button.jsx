import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  secondary: 'bg-navy text-white hover:bg-navy-light',
  outline: 'border border-navy/20 bg-white text-navy hover:border-navy hover:bg-surface',
  ghost: 'text-navy hover:bg-navy/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  light: 'bg-white text-navy hover:bg-surface',
};
const sizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
  icon: 'h-10 w-10',
};

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, to, href, className, children, disabled, ...props },
  ref,
) {
  const cls = cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold transition-colors',
    'disabled:pointer-events-none disabled:opacity-60',
    variants[variant], sizes[size], className,
  );
  if (to) return <Link ref={ref} to={to} className={cls} {...props}>{children}</Link>;
  if (href) return <a ref={ref} href={href} className={cls} {...props}>{children}</a>;
  return (
    <button ref={ref} type="button" className={cls} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
