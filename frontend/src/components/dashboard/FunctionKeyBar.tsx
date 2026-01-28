'use client'

interface FunctionKeyBarProps {
  activePanel: string
  onPanelChange: (panel: string) => void
}

const functionKeys = [
  { key: 'F1', label: 'Help', panel: 'help' },
  { key: 'F2', label: 'Calendar', panel: 'calendar' },
  { key: 'F3', label: 'Analytics', panel: 'analytics' },
  { key: 'F4', label: 'Channels', panel: 'channels' },
  { key: 'F5', label: 'Inventory', panel: 'inventory' },
  { key: 'F6', label: 'Budget', panel: 'budget' },
  { key: 'F7', label: 'Competitors', panel: 'competitors' },
  { key: 'F8', label: 'Settings', panel: 'settings' },
]

export function FunctionKeyBar({ activePanel, onPanelChange }: FunctionKeyBarProps) {
  return (
    <div className="h-8 bg-terminal-bg-secondary border-t border-terminal-border flex items-center px-2 gap-1">
      {functionKeys.map((fk) => (
        <button
          key={fk.key}
          onClick={() => onPanelChange(fk.panel)}
          className={`function-key rounded ${
            activePanel === fk.panel ? 'bg-terminal-text-primary text-black' : ''
          }`}
        >
          <span className="text-terminal-text-primary mr-1">[{fk.key}]</span>
          <span>{fk.label}</span>
        </button>
      ))}

      <div className="flex-1" />

      <div className="flex items-center gap-2 text-xs text-terminal-text-muted">
        <span>21 Agents</span>
        <span>|</span>
        <span>5 Divisions</span>
        <span>|</span>
        <span className="text-terminal-accent-positive">System Ready</span>
      </div>
    </div>
  )
}
