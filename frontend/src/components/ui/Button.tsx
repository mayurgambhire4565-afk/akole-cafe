import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizeClasses: Record<Size, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  icon: 'btn-icon',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={twMerge(clsx('btn', variantClasses[variant], sizeClasses[size], className))}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {size !== 'icon' && <span>{children}</span>}
      {!isLoading && size === 'icon' && children}
      {!isLoading && rightIcon && rightIcon}
    </motion.button>
  );
}
