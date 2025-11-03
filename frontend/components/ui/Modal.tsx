import React from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  submitText?: string
  cancelText?: string
  showSubmitButton?: boolean
  showCancelButton?: boolean
  submitDisabled?: boolean
  submitVariant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = '저장',
  cancelText = '취소',
  showSubmitButton = true,
  showCancelButton = true,
  submitDisabled = false,
  submitVariant = 'primary',
  maxWidth = '4xl'
}) => {
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    }
  }

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 pt-20"
      onClick={handleBackgroundClick}
      style={{zIndex: 40, backdropFilter: 'blur(8px) saturate(150%)'}}
    >
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-2xl font-bold text-white mb-6">
          {title}
        </h2>
        
        {onSubmit ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {children}
            
            <div className="flex justify-end space-x-3">
              {showCancelButton && (
                <Button type="button" onClick={onClose} variant="ghost">
                  {cancelText}
                </Button>
              )}
              {showSubmitButton && (
                <Button type="submit" variant={submitVariant} disabled={submitDisabled}>
                  {submitText}
                </Button>
              )}
            </div>
          </form>
        ) : (
          <>
            {children}
            {showCancelButton && (
              <div className="flex justify-end mt-6">
                <Button onClick={onClose} variant="ghost">
                  {cancelText}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Modal
