import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/utils';

const inputVariants = cva(
  'flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        text: 'h-10 w-full',
        file: 'h-10 w-full',
        input: 'h-10 w-full',
        bordered: 'h-10 w-full',
        toggle: 'h-5 w-10 toggle',
        range: 'h-2 w-full accent-primary',
      },
      size: {},
    },
  }
);

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'input', size, ...props }, ref) => {
    let type = props.type;
    if (!type) {
      switch (variant) {
        case 'file':
          type = 'file';
          break;
        case 'toggle':
          type = 'checkbox';
          break;
        case 'range':
          type = 'range';
          break;
        default:
          type = 'text';
      }
    }

    return (
      <input
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
