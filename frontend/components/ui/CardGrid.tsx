'use client'

import { Card } from './Card'
import { Title, Text } from './Text'

interface CardGridProps<T> {
  data: T[]
  keyField: string
  renderCard: (item: T) => React.ReactNode
  emptyMessage?: string
  className?: string
  columns?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export function CardGrid<T extends Record<string, any>>({
  data,
  keyField,
  renderCard,
  emptyMessage = '데이터가 없습니다.',
  className = '',
  columns = {
    default: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4
  }
}: CardGridProps<T>) {
  const gridClasses = [
    'grid gap-6',
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`
  ].filter(Boolean).join(' ')

  if (data.length === 0) {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-8 text-center ${className}`}>
        <Text variant="muted">{emptyMessage}</Text>
      </div>
    )
  }

  return (
    <div className={`${gridClasses} ${className}`}>
      {data.map((item) => (
        <div key={item[keyField]}>
          {renderCard(item)}
        </div>
      ))}
    </div>
  )
}
