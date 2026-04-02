import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Send, Square, Paperclip, CornerDownLeft } from 'lucide-react'

export function PromptBox({ onSend, onStop, streaming, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [value])

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || streaming) return
    onSend(trimmed)
    setValue('')
    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [value, streaming, onSend])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const canSend = value.trim().length > 0 && !streaming && !disabled

  return (
    <div className="border-t border-forge-border bg-forge-surface px-4 py-3 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        {/* Input wrapper */}
        <div className={`
          flex items-end gap-2 rounded-xl border transition-all duration-150
          bg-forge-panel
          ${disabled ? 'border-forge-border opacity-60' : 'border-forge-border hover:border-forge-border-light focus-within:border-forge-accent/40 focus-within:shadow-forge-glow'}
        `}>
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || streaming}
            placeholder={streaming ? 'Forge is responding…' : 'Ask anything about code… (Enter to send, Shift+Enter for newline)'}
            rows={1}
            className="
              flex-1 resize-none bg-transparent
              text-sm font-mono text-forge-text
              placeholder-forge-text-dim/60
              px-4 py-3
              focus:outline-none
              min-h-[46px] max-h-[200px]
              leading-relaxed
            "
          />

          {/* Action buttons */}
          <div className="flex items-center gap-1 pr-2 pb-2">
            {/* Stop */}
            {streaming && (
              <button
                onClick={onStop}
                title="Stop generation"
                className="
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                  text-xs font-mono text-forge-red
                  border border-forge-red/30 bg-forge-red/10
                  hover:bg-forge-red/20 hover:border-forge-red/50
                  transition-all duration-100
                "
              >
                <Square size={10} className="fill-forge-red" />
                stop
              </button>
            )}

            {/* Send */}
            {!streaming && (
              <button
                onClick={handleSend}
                disabled={!canSend}
                title="Send (Enter)"
                className={`
                  flex items-center justify-center w-8 h-8 rounded-lg
                  transition-all duration-100 active:scale-95
                  ${canSend
                    ? 'bg-forge-accent text-forge-bg hover:bg-forge-accent-dim shadow-forge-glow'
                    : 'bg-forge-border text-forge-muted cursor-not-allowed'}
                `}
              >
                <Send size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[10px] font-mono text-forge-text-dim">
            <CornerDownLeft size={9} className="inline mr-0.5" />
            send &nbsp;·&nbsp;
            <span className="opacity-70">shift+enter</span> newline
          </p>
          <p className="text-[10px] font-mono text-forge-text-dim opacity-50">
            responses may be inaccurate
          </p>
        </div>
      </div>
    </div>
  )
}
