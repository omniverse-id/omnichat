import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { Button as ShadcnButton } from './ui/button';

const ButtonVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80',
      neutral: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-muted hover:text-foreground',
      error: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
      'menu-item':
        'hover:bg-muted hover:text-foreground font-normal justify-start',
    },
    size: {
      default: 'h-8 gap-1.5 px-2.5',
      small: 'h-7 gap-1 px-2.5 text-sm',
      icon: 'size-8',
      'icon-sm': 'size-6',
      'icon-md': 'size-7',
      'icon-xl': 'size-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof ButtonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    // Map custom variants to shadcn variants
    let shadcnVariant:
      | 'default'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'destructive'
      | 'link' = 'default';
    if (variant === 'neutral') shadcnVariant = 'secondary';
    else if (variant === 'error') shadcnVariant = 'destructive';
    else if (variant === 'menu-item') shadcnVariant = 'ghost';
    else if (variant === 'ghost') shadcnVariant = 'ghost';

    let shadcnSize:
      | 'default'
      | 'xs'
      | 'sm'
      | 'lg'
      | 'icon'
      | 'icon-xs'
      | 'icon-sm'
      | 'icon-lg' = 'default';
    if (size === 'small') shadcnSize = 'sm';
    else if (size === 'icon') shadcnSize = 'icon';
    else if (size === 'icon-sm') shadcnSize = 'icon-sm';
    else if (size === 'icon-md') shadcnSize = 'icon';
    else if (size === 'icon-xl') shadcnSize = 'icon-lg';

    return (
      <ShadcnButton
        className={cn(ButtonVariants({ variant, size, className }))}
        variant={shadcnVariant}
        size={shadcnSize}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
