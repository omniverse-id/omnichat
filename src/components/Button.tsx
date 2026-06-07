import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/utils';

const ButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        neutral: 'bg-muted text-muted-foreground hover:bg-muted/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        error: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        'menu-item': 'font-normal justify-start hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        small: 'h-9 px-3 text-xs',
        icon: 'h-10 w-10 p-0 rounded-md',
        'icon-sm': 'h-9 w-9 p-0 rounded-md',
        'icon-md': 'h-9 w-9 p-0 rounded-md',
        'icon-xl': 'h-10 w-10 p-0 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof ButtonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(ButtonVariants({ variant, size, className }))}
      ref={ref}
      dir="auto"
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button };
