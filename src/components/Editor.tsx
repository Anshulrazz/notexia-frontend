'use client'

import { useState } from 'react'
import { Bold, Italic, List, ListOrdered, Link2, Image, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils/helpers'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function Editor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className,
  minHeight = '200px',
}: EditorProps) {
  const [isPreview, setIsPreview] = useState(false)

  const insertMarkdown = (prefix: string, suffix = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)
    onChange(newText)
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic' },
    { icon: Code, action: () => insertMarkdown('`', '`'), title: 'Code' },
    { icon: List, action: () => insertMarkdown('\n- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('\n1. '), title: 'Numbered List' },
    { icon: Link2, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
    { icon: Image, action: () => insertMarkdown('![alt](', ')'), title: 'Image' },
  ]

  return (
    <div className={cn('rounded-lg border border-[#2a2a3e] bg-[#1e1e2e] overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b border-[#2a2a3e] px-3 py-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-[#2a2a3e]"
              onClick={btn.action}
              title={btn.title}
              type="button"
            >
              <btn.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-xs',
              !isPreview ? 'text-violet-400 bg-violet-500/10' : 'text-slate-400'
            )}
            onClick={() => setIsPreview(false)}
            type="button"
          >
            Write
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-xs',
              isPreview ? 'text-violet-400 bg-violet-500/10' : 'text-slate-400'
            )}
            onClick={() => setIsPreview(true)}
            type="button"
          >
            Preview
          </Button>
        </div>
      </div>

      {isPreview ? (
        <div
          className="p-4 prose prose-invert prose-sm max-w-none text-slate-300"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{
            __html: value
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`(.*?)`/g, '<code class="bg-[#2a2a3e] px-1 rounded">$1</code>')
              .replace(/\n/g, '<br />'),
          }}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-0 bg-transparent resize-none focus-visible:ring-0 text-white placeholder:text-slate-500"
          style={{ minHeight }}
        />
      )}
    </div>
  )
}
