'use client'

interface CalendarEvent {
  id: string
  date: string
  type: 'promotion' | 'deadline' | 'event'
  title: string
  status?: 'active' | 'scheduled' | 'completed'
}

const events: CalendarEvent[] = [
  { id: '1', date: '2026-02-05', type: 'promotion', title: 'Winter Flash Sale ends', status: 'active' },
  { id: '2', date: '2026-02-10', type: 'promotion', title: 'Lunar New Year Gift Set', status: 'scheduled' },
  { id: '3', date: '2026-02-15', type: 'deadline', title: 'Q2 Planning submission' },
  { id: '4', date: '2026-02-20', type: 'event', title: 'Oliveyoung Festa deadline' },
]

export function PromotionCalendar() {
  const months = ['FEB', 'MAR', 'APR']

  return (
    <div className="terminal-panel h-full">
      <div className="terminal-panel-header flex items-center justify-between">
        <span>PROMOTION CALENDAR - Q1 2026</span>
        <div className="flex gap-2 text-xs">
          {months.map((month) => (
            <button
              key={month}
              className={`px-2 py-0.5 rounded ${
                month === 'FEB' ? 'bg-terminal-text-primary text-black' : 'text-terminal-text-muted hover:text-white'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
      <div className="terminal-panel-content flex gap-4 overflow-x-auto">
        {/* Timeline visualization */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-terminal-text-muted w-16">FEB</span>
            <div className="flex-1 h-4 bg-terminal-bg-tertiary rounded overflow-hidden">
              <div className="h-full w-[40%] bg-terminal-accent-positive/50 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-terminal-text-muted w-16">MAR</span>
            <div className="flex-1 h-4 bg-terminal-bg-tertiary rounded overflow-hidden">
              <div className="h-full w-[60%] bg-terminal-text-secondary/50 rounded" />
            </div>
          </div>
        </div>

        {/* Events list */}
        <div className="w-64 space-y-2">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${
                event.type === 'promotion' ? 'bg-terminal-accent-positive' :
                event.type === 'deadline' ? 'bg-terminal-accent-negative' :
                'bg-terminal-text-secondary'
              }`} />
              <span className="text-terminal-text-muted w-20">{event.date.slice(5)}</span>
              <span className="text-white truncate">{event.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
