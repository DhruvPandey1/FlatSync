import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}) => {
  const buttonClass = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;
  
  return (
    <button 
      className={buttonClass} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className={styles.spinner}></span> : children}
    </button>
  );
};
