import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { Label as ShadcnLabel } from './ui/label';

const LabelVariants = cva('', {
  variants: {
    variant: {
      default: '',
      'group-title': 'block font-bold text-foreground text-start',
      'fake-btn': 'text-center cursor-pointer',
      btn: 'inline-flex items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground px-2.5 py-1.5 text-sm font-medium',
      'btn-ghost':
        'inline-flex items-center justify-center hover:bg-muted rounded-lg',
      'form-control': 'flex flex-col justify-center',
      'input-bordered':
        'inline-flex grow items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring',
    },
    size: {
      default: '',
      xs: 'text-xs',
      icon: 'size-8',
      'icon-xl': 'size-8 rounded-lg',
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
    <ShadcnLabel
      className={cn(LabelVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };
