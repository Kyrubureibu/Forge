import React, { useEffect, useRef } from 'react'
import { Message } from './Message.jsx'
import { Terminal } from 'lucide-react'

export function MessageList({ messages, streaming }) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)
  const userScrolledRef = useRef(false)

  // Auto-scroll unless user has scrolled up
  useEffect(() => {
    if (userScrolledRef.current) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const atBottom = scrollHeight - scrollTop - clientHeight < 80
      userScrolledRef.current = !atBottom
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Reset userScrolled when new message comes in from user
  const lastRole = messages[messages.length - 1]?.role
  useEffect(() => {
    if (lastRole === 'user') userScrolledRef.current = false
  }, [lastRole])

  if (messages.length === 0) {
    return <EmptyState />
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto divide-y divide-forge-border/40">
        {messages.map((msg, i) => {
          const isLast = i === messages.length - 1
          const isStreamingThis = isLast && streaming && msg.role === 'assistant'
          return (
            <Message
              key={msg.id}
              message={msg}
              isStreaming={isStreamingThis}
            />
          )
        })}
      </div>
      <div ref={bottomRef} className="h-4" />
    </div>
  )
}

function EmptyState() {
  const hints = [
    'Write a REST API in Go with JWT auth',
    'Explain this Python traceback and fix it',
    'Review my React component for performance',
    'Generate a SQL schema for a blog platform',
    'Write unit tests for this function',
    'Convert this JS to TypeScript with types',
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-forge-accent/10 border border-forge-accent/20 flex items-center justify-center mb-4">
        <Terminal size={22} className="text-forge-accent" />
      </div>
      <h2 className="text-base font-semibold font-mono text-forge-text mb-1">
        forge<span className="text-forge-accent"> ›</span>
      </h2>
      <p className="text-sm text-forge-text-dim mb-8 max-w-xs">
        Terminal AI coding assistant. Ask anything about code, systems, or architecture.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {hints.map((hint) => (
          <button
            key={hint}
            className="
              text-left px-3 py-2.5 rounded-lg
              border border-forge-border hover:border-forge-border-light
              bg-forge-surface hover:bg-forge-panel
              text-xs font-mono text-forge-text-dim hover:text-forge-text
              transition-all duration-150
            "
          >
            <span className="text-forge-accent mr-1.5">$</span>
            {hint}
          </button>
        ))}
      </div>
    </div>
  )
}

