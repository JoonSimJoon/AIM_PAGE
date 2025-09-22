import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  [key: string]: any // 추가 props 허용
}

export const Button: React.FC<ButtonProps> = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-black focus:ring-cyan-300',
    secondary: 'bg-pink-600 hover:bg-pink-700 text-white focus:ring-pink-300',
    ghost: 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 focus:ring-gray-300',
    outline: 'bg-transparent border-2 border-gray-600 text-white hover:border-cyan-400 hover:text-cyan-400 focus:ring-cyan-300'
  }
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg'
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`.trim()
  
  return (
    <Component
      className={buttonClasses}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          로딩중...
        </div>
      ) : (
        children
      )}
    </Component>
  )
}

export default Button
