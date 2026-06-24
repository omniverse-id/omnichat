import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
import { Input as ShadcnInput } from './ui/input';

const inputVariants = cva('', {
  variants: {
    variant: {
      text: '',
      file: '',
      input: '',
      bordered: 'border border-input',
      toggle: '',
      range: '',
    },
    size: {},
  },
});

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => {
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
      <ShadcnInput
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
