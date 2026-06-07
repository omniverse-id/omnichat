import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/utils';

const LabelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    variant: {
      default: '',
      'group-title': 'block font-bold text-foreground text-start opacity-75',
      'fake-btn': 'text-center cursor-pointer',
      btn: 'inline-flex items-center justify-center',
      'btn-ghost': 'hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2',
      'form-control': 'flex flex-col justify-center',
      'input-bordered':
        'flex items-center gap-2 border border-input rounded-md px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
    },
    size: {
      default: '',
      xs: 'text-xs',
      icon: 'w-8 h-8 p-0',
      'icon-xl': 'w-8 h-8 p-0 rounded-md',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof LabelVariants>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, size, ...props }, ref) => (
    <label
      className={cn(LabelVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };
