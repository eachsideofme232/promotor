'use client'

import { useState } from 'react'
import { ChannelStatus } from './ChannelStatus'
import { LiveMetrics } from './LiveMetrics'
import { AgentChat } from './AgentChat'
import { AlertsPanel } from './AlertsPanel'
import { PromotionCalendar } from './PromotionCalendar'
import { FunctionKeyBar } from './FunctionKeyBar'
import { TitleBar } from './TitleBar'

export function TerminalLayout() {
  const [activePanel, setActivePanel] = useState<string>('dashboard')

  return (
    <div className="h-screen flex flex-col bg-terminal-bg-primary">
      {/* Title Bar */}
      <TitleBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* Left Sidebar */}
        <div className="w-64 flex flex-col gap-2">
          <ChannelStatus />
          <LiveMetrics />
          <AlertsPanel />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-2">
          {/* AI Assistant */}
          <div className="flex-1">
            <AgentChat />
          </div>

          {/* Bottom Panel - Calendar */}
          <div className="h-48">
            <PromotionCalendar />
          </div>
        </div>
      </div>

      {/* Function Key Bar */}
      <FunctionKeyBar activePanel={activePanel} onPanelChange={setActivePanel} />
    </div>
  )
}
