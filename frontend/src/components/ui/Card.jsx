import { cn } from '../../lib/utils';

export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-navy/5 bg-white shadow-card',
        hover && 'transition duration-300 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = 'primary', className }) {
  const tones = {
    primary: 'bg-primary-light text-primary-dark',
    navy: 'bg-navy/10 text-navy',
    green: 'bg-emerald-100 text-emerald-800',
    gray: 'bg-surface text-navy-muted ring-1 ring-navy/10',
    amber: 'bg-amber-100 text-amber-800',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)}>
      {children}
    </span>
  );
}
