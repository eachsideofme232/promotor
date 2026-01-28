'use client'

interface Channel {
  name: string
  code: string
  status: 'online' | 'offline' | 'degraded'
  lastSync: string
}

const channels: Channel[] = [
  { name: 'OLIVEYOUNG', code: 'oliveyoung', status: 'online', lastSync: '2m ago' },
  { name: 'COUPANG', code: 'coupang', status: 'online', lastSync: '1m ago' },
  { name: 'NAVER', code: 'naver', status: 'online', lastSync: '3m ago' },
  { name: 'KAKAO', code: 'kakao', status: 'degraded', lastSync: '15m ago' },
]

export function ChannelStatus() {
  return (
    <div className="terminal-panel">
      <div className="terminal-panel-header">
        CHANNEL STATUS
      </div>
      <div className="terminal-panel-content">
        <div className="space-y-2">
          {channels.map((channel) => (
            <div key={channel.code} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`status-indicator ${
                  channel.status === 'online' ? 'status-online' :
                  channel.status === 'degraded' ? 'status-degraded' :
                  'status-offline'
                }`} />
                <span className="text-sm text-white">{channel.name}</span>
              </div>
              <span className="text-xs text-terminal-text-muted">{channel.lastSync}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
