import React, { useState } from 'react'
import {
  Settings, Trash2, Download, ChevronRight,
  AlertTriangle, Wifi, WifiOff
} from 'lucide-react'
import { MessageList } from './MessageList.jsx'
import { PromptBox } from './PromptBox.jsx'
import { Select } from '../UI/Select.jsx'
import { Button } from '../UI/Button.jsx'
import { MODELS, PROVIDERS } from '../../lib/models.js'
import { getSettings, saveSettings } from '../../lib/storage.js'

export function ChatPanel({
  messages,
  streaming,
  error,
  onSend,
  onStop,
  onClear,
  onOpenSettings,
  serverOnline,
}) {
  const settings = getSettings()
  const [provider, setProviderState] = useState(settings.provider)
  const [model, setModelState] = useState(settings.model)

  const providerOptions = Object.values(PROVIDERS).map((p) => ({
    value: p.id,
    label: p.name,
  }))

  const modelOptions = (MODELS[provider] ?? []).map((m) => ({
    value: m.id,
    label: m.name,
  }))

  const handleProviderChange = (val) => {
    setProviderState(val)
    const firstModel = MODELS[val]?.[0]?.id ?? ''
    setModelState(firstModel)
    saveSettings({ provider: val, model: firstModel })
  }

  const handleModelChange = (val) => {
    setModelState(val)
    saveSettings({ model: val })
  }

  const handleExport = () => {
    if (messages.length === 0) return
    const text = messages
      .map((m) => `[${m.role.toUpperCase()}]\n${m.content}`)
      .join('\n\n---\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `forge-session-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      {/* ── Toolbar ─────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-forge-border bg-forge-surface flex-shrink-0">
        {/* Provider selector */}
        <Select
          value={provider}
          onChange={handleProviderChange}
          options={providerOptions}
          className="w-36"
        />

        {/* Model selector */}
        <Select
          value={model}
          onChange={handleModelChange}
          options={modelOptions}
          className="flex-1 max-w-xs"
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Server status */}
        <div
          title={serverOnline ? 'Backend connected' : 'Backend offline — check server'}
          className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded border ${
            serverOnline
              ? 'text-forge-green border-forge-green/20 bg-forge-green/5'
              : 'text-forge-red border-forge-red/20 bg-forge-red/5'
          }`}
        >
          {serverOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
          {serverOnline ? 'live' : 'offline'}
        </div>

        {/* Actions */}
        {messages.length > 0 && (
          <>
            <Button variant="ghost" size="xs" onClick={handleExport} title="Export session">
              <Download size={12} />
            </Button>
            <Button variant="ghost" size="xs" onClick={onClear} title="Clear chat">
              <Trash2 size={12} />
            </Button>
          </>
        )}

        <Button variant="ghost" size="xs" onClick={onOpenSettings} title="Settings">
          <Settings size={12} />
        </Button>
      </div>

      {/* ── Error banner ─────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-forge-red/10 border-b border-forge-red/20 text-forge-red text-xs font-mono animate-fade-in">
          <AlertTriangle size={12} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Messages ─────────────────────────────── */}
      <MessageList messages={messages} streaming={streaming} />

      {/* ── Prompt box ───────────────────────────── */}
      <PromptBox
        onSend={onSend}
        onStop={onStop}
        streaming={streaming}
        disabled={!serverOnline}
      />
    </div>
  )
}
