import React, { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Copy, Check, User, Terminal, AlertTriangle } from 'lucide-react'

/* ── Copy button for code blocks ─────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [text])

  return (
    <button
      onClick={handleCopy}
      title="Copy code"
      className="
        flex items-center gap-1 px-2 py-1 rounded
        text-[10px] font-mono
        text-forge-text-dim hover:text-forge-text
        bg-forge-border/50 hover:bg-forge-border
        transition-all duration-100
      "
    >
      {copied ? (
        <><Check size={10} className="text-forge-accent" /> copied</>
      ) : (
        <><Copy size={10} /> copy</>
      )}
    </button>
  )
}

/* ── Code block with header bar ──────────────────────────────────────────── */
function CodeBlock({ children, className }) {
  const language = className?.replace('language-', '') ?? 'text'
  const code = String(children).replace(/\n$/, '')

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-forge-border">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-forge-bg border-b border-forge-border">
        <span className="text-[10px] font-mono text-forge-text-dim tracking-wider">
          {language}
        </span>
        <CopyButton text={code} />
      </div>
      {/* Code */}
      <pre className="!m-0 !border-0 !rounded-none overflow-x-auto p-4 bg-[#0a0a0d] text-[0.8rem] leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

/* ── Inline code ─────────────────────────────────────────────────────────── */
function InlineCode({ children }) {
  return (
    <code className="bg-forge-panel border border-forge-border px-1.5 py-0.5 rounded text-[0.82em] font-mono text-forge-accent">
      {children}
    </code>
  )
}

/* ── Thinking / streaming dots ───────────────────────────────────────────── */
function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-forge-accent animate-pulse-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  )
}

/* ── Main Message component ──────────────────────────────────────────────── */
export function Message({ message, isStreaming }) {
  const isUser = message.role === 'user'
  const isEmpty = !message.content && isStreaming

  return (
    <div
      className={`
        flex gap-3 px-4 py-4 animate-fade-in
        ${isUser ? '' : 'bg-forge-surface/40'}
      `}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-7 h-7 rounded-md bg-forge-purple/20 border border-forge-purple/30 flex items-center justify-center">
            <User size={13} className="text-forge-purple" />
          </div>
        ) : (
          <div className={`
            w-7 h-7 rounded-md flex items-center justify-center
            ${message.isError
              ? 'bg-forge-red/10 border border-forge-red/30'
              : 'bg-forge-accent/10 border border-forge-accent/30'}
          `}>
            {message.isError
              ? <AlertTriangle size={13} className="text-forge-red" />
              : <Terminal size={13} className="text-forge-accent" />
            }
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        {/* Role label */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-mono font-semibold uppercase tracking-widest ${
            isUser ? 'text-forge-purple' : 'text-forge-accent'
          }`}>
            {isUser ? 'you' : 'forge'}
          </span>
          {message.ts && (
            <span className="text-[10px] text-forge-text-dim">
              {new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Message body */}
        {isEmpty ? (
          <div className="flex items-center gap-2 text-xs text-forge-text-dim">
            <span className="font-mono">thinking</span>
            <ThinkingDots />
          </div>
        ) : isUser ? (
          <p className="text-sm text-forge-text whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div className="forge-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  if (inline) return <InlineCode>{children}</InlineCode>
                  return <CodeBlock className={className}>{children}</CodeBlock>
                },
                // Override pre to avoid double-wrapping from rehype-highlight
                pre({ children }) {
                  return <>{children}</>
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && <span className="cursor-blink" />}
          </div>
        )}
      </div>
    </div>
  )
}

