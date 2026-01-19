'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { cn } from '@/utils/helpers'
import { Copy, Check } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] rounded-t-lg border-b border-slate-700">
        <span className="text-xs text-slate-400 font-mono">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
          padding: '1rem',
          fontSize: '0.875rem',
          background: '#1e1e2e',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(
      'prose prose-invert max-w-none',
      'prose-headings:text-white prose-headings:font-semibold prose-headings:border-b prose-headings:border-slate-700 prose-headings:pb-2',
      'prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-4',
      'prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3',
      'prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2 prose-h3:border-0',
      'prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2 prose-h4:border-0',
      'prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-3',
      'prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',
      'prose-strong:text-white prose-strong:font-semibold',
      'prose-em:text-slate-300 prose-em:italic',
      'prose-code:text-orange-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none',
      'prose-blockquote:border-l-4 prose-blockquote:border-l-violet-500 prose-blockquote:bg-violet-500/10 prose-blockquote:pl-4 prose-blockquote:pr-4 prose-blockquote:py-2 prose-blockquote:rounded-r prose-blockquote:italic prose-blockquote:text-slate-300 prose-blockquote:not-italic prose-blockquote:my-4',
      'prose-ul:my-3 prose-ul:pl-6',
      'prose-ol:my-3 prose-ol:pl-6',
      'prose-li:text-slate-300 prose-li:my-1 prose-li:marker:text-violet-400',
      'prose-table:border-collapse prose-table:w-full prose-table:my-4',
      'prose-thead:bg-slate-800',
      'prose-th:border prose-th:border-slate-600 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold',
      'prose-td:border prose-td:border-slate-700 prose-td:px-4 prose-td:py-2',
      'prose-tr:even:bg-slate-800/50',
      'prose-img:rounded-lg prose-img:my-4 prose-img:max-w-full prose-img:shadow-lg',
      'prose-hr:border-slate-700 prose-hr:my-6',
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match && !className
            
            if (isInline) {
              return (
                <code className="text-orange-300 bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            }
            
            return (
              <CodeBlock
                language={match ? match[1] : ''}
                value={String(children).replace(/\n$/, '')}
              />
            )
          },
          pre({ children }) {
            return <>{children}</>
          },
          a({ href, children }) {
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                {children}
              </a>
            )
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-slate-700">
                <table className="w-full">{children}</table>
              </div>
            )
          },
          input({ checked, ...props }) {
            return (
              <input
                type="checkbox"
                checked={checked}
                readOnly
                className="mr-2 accent-violet-500"
                {...props}
              />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
