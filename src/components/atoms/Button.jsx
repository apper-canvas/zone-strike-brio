import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  size = 'md', 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/80 text-white border-primary/50',
    secondary: 'bg-secondary hover:bg-secondary/80 text-white border-secondary/50',
    outline: 'bg-transparent hover:bg-white/10 text-white border-gray-600',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-400 hover:text-white border-transparent'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${className}
        font-medium rounded-lg border-2 transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        focus:outline-none focus:ring-2 focus:ring-primary/50
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;