import React from 'react'

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  variant?: 'primary' | 'secondary' | 'muted' | 'gradient' | 'error'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  align?: 'left' | 'center' | 'right'
  children: React.ReactNode
}

export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  variant = 'primary',
  size = 'base',
  weight = 'normal',
  align = 'left',
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'text-white',
    secondary: 'text-gray-400',
    muted: 'text-gray-500',
    gradient: 'bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent',
    error: 'text-red-500'
  }
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  }
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  const textClasses = `${variantClasses[variant]} ${sizeClasses[size]} ${weightClasses[weight]} ${alignClasses[align]} ${className}`.trim()
  
  return (
    <Component className={textClasses} {...props}>
      {children}
    </Component>
  )
}

// 특화된 텍스트 컴포넌트들
export const Title: React.FC<Omit<TextProps, 'as' | 'size' | 'weight'> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }> = ({
  level = 1,
  variant = 'primary',
  children,
  className = '',
  align = 'left',
  ...props
}) => {
  const Component = `h${level}` as React.ElementType
  const sizes = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg'
  }
  
  return (
    <Text 
      as={Component} 
      variant={variant} 
      size={sizes[level] as TextProps['size']}
      weight="bold" 
      align={align}
      className={className} 
      {...props}
    >
      {children}
    </Text>
  )
}

export const Subtitle: React.FC<Omit<TextProps, 'as' | 'size' | 'weight'>> = ({
  variant = 'secondary',
  children,
  className = '',
  align = 'left',
  ...props
}) => {
  return (
    <Text 
      as="p" 
      variant={variant} 
      size="xl" 
      align={align}
      className={`leading-relaxed ${className}`} 
      {...props}
    >
      {children}
    </Text>
  )
}

export default Text