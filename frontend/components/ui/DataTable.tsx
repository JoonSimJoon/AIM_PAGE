'use client'

import { useState } from 'react'
import { Button } from './Button'
import { Text } from './Text'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: string
  selectable?: boolean
  onSelectionChange?: (selectedItems: T[]) => void
  onBulkAction?: (action: string, selectedItems: T[]) => void
  bulkActions?: Array<{
    key: string
    label: string
    icon?: string
    variant?: 'primary' | 'secondary' | 'danger'
  }>
  emptyMessage?: string
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  selectable = false,
  onSelectionChange,
  onBulkAction,
  bulkActions = [],
  emptyMessage = '데이터가 없습니다.',
  className = ''
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems([...data])
      onSelectionChange?.(data)
    } else {
      setSelectedItems([])
      onSelectionChange?.([])
    }
  }

  const handleSelectItem = (item: T, checked: boolean) => {
    let newSelection: T[]
    if (checked) {
      newSelection = [...selectedItems, item]
    } else {
      newSelection = selectedItems.filter(selected => selected[keyField] !== item[keyField])
    }
    setSelectedItems(newSelection)
    onSelectionChange?.(newSelection)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0
    
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    // null/undefined 처리
    if (aValue == null || aValue === '') aValue = sortField === 'generation' ? 0 : ''
    if (bValue == null || bValue === '') bValue = sortField === 'generation' ? 0 : ''
    
    // 숫자 정렬 (기수, 학번 등)
    if (sortField === 'generation' || sortField === 'studentId') {
      const numA = Number(aValue) || 0
      const numB = Number(bValue) || 0
      return sortDirection === 'asc' ? numA - numB : numB - numA
    }
    
    // 날짜 정렬
    if (sortField === 'createdAt') {
      const dateA = new Date(aValue).getTime()
      const dateB = new Date(bValue).getTime()
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
    }
    
    // 직책 정렬 (관리자 → 회장 → 부회장 → 운영진)
    if (sortField === 'position') {
      const getPositionOrder = (position: string) => {
        const pos = position.toLowerCase()
        if (pos === '관리자') return 0
        if (pos === '회장') return 1
        if (pos === '부회장') return 2
        if (pos === '운영진') return 3
        return 4 // 기타 직책
      }
      
      const orderA = getPositionOrder(String(aValue))
      const orderB = getPositionOrder(String(bValue))
      
      if (orderA !== orderB) {
        return sortDirection === 'asc' ? orderA - orderB : orderB - orderA
      }
      
      // 같은 순위 내에서는 가나다 순
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr, 'ko')
        : bStr.localeCompare(aStr, 'ko')
    }
    
    // 문자열 정렬 (한국어 지원)
    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr, 'ko')
    } else {
      return bStr.localeCompare(aStr, 'ko')
    }
  })

  const isAllSelected = data.length > 0 && selectedItems.length === data.length
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length

  if (data.length === 0) {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-8 text-center ${className}`}>
        <Text variant="muted">{emptyMessage}</Text>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Bulk Actions */}
      {selectable && selectedItems.length > 0 && bulkActions.length > 0 && (
        <div className="bg-gray-700 px-6 py-3 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <Text variant="secondary" size="sm">
              {selectedItems.length}개 항목 선택됨
            </Text>
            <div className="flex gap-2">
              {bulkActions.map(action => (
                <Button
                  key={action.key}
                  onClick={() => onBulkAction?.(action.key, selectedItems)}
                  variant={action.variant || 'secondary'}
                  size="sm"
                >
                  {action.icon && <span className="mr-1">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && sortField === column.key && (
                      <span className="text-cyan-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {sortedData.map((item) => (
              <tr key={item[keyField]} className="hover:bg-gray-700 transition-colors">
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.some(selected => selected[keyField] === item[keyField])}
                      onChange={(e) => handleSelectItem(item, e.target.checked)}
                      className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
