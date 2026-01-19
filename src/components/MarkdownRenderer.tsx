'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/utils/helpers'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(
      'prose prose-invert max-w-none',
      'prose-headings:text-white prose-headings:font-semibold',
      'prose-h1:text-2xl prose-h1:mt-4 prose-h1:mb-2',
      'prose-h2:text-xl prose-h2:mt-4 prose-h2:mb-2',
      'prose-h3:text-lg prose-h3:mt-3 prose-h3:mb-2',
      'prose-p:text-slate-300 prose-p:leading-relaxed',
      'prose-a:text-blue-400 prose-a:hover:underline',
      'prose-strong:text-white prose-strong:font-semibold',
      'prose-em:text-slate-300 prose-em:italic',
      'prose-code:text-orange-300 prose-code:bg-slate-900/50 prose-code:px-2 prose-code:py-1 prose-code:rounded',
      'prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-700',
      'prose-blockquote:border-l-4 prose-blockquote:border-l-blue-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-400',
      'prose-ul:list-disc prose-ul:list-inside prose-ul:text-slate-300',
      'prose-ol:list-decimal prose-ol:list-inside prose-ol:text-slate-300',
      'prose-li:my-1',
      'prose-table:border-collapse prose-table:w-full',
      'prose-th:bg-slate-800 prose-th:border prose-th:border-slate-700 prose-th:px-3 prose-th:py-2',
      'prose-td:border prose-td:border-slate-700 prose-td:px-3 prose-td:py-2',
      'prose-img:rounded-lg prose-img:my-4 prose-img:max-w-full',
      'prose-hr:border-slate-700',
      className
    )}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
