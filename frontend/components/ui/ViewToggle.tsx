'use client'

interface ViewToggleProps {
  currentView: string
  views: Array<{
    key: string
    label: string
    icon?: string
  }>
  onViewChange: (view: string) => void
  className?: string
}

export function ViewToggle({
  currentView,
  views,
  onViewChange,
  className = ''
}: ViewToggleProps) {
  return (
    <div className={`flex bg-gray-700 rounded-lg p-1 ${className}`}>
      {views.map((view) => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currentView === view.key
              ? 'bg-cyan-500 text-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          {view.icon && <span className="mr-1">{view.icon}</span>}
          {view.label}
        </button>
      ))}
    </div>
  )
}
