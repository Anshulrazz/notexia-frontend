'use client'

import { useCallback, useState } from 'react'
import { Upload, X, File, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/helpers'
import { formatFileSize } from '@/utils/helpers'

interface FileUploadProps {
  accept?: string
  maxSize?: number
  onFileSelect: (file: File) => void
  onError?: (error: string) => void
  className?: string
  variant?: 'default' | 'avatar'
}

export function FileUpload({
  accept = '*/*',
  maxSize = 10 * 1024 * 1024,
  onFileSelect,
  onError,
  className,
  variant = 'default',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        onError?.(`File size must be less than ${formatFileSize(maxSize)}`)
        return
      }

      setSelectedFile(file)
      onFileSelect(file)

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      }
    },
    [maxSize, onFileSelect, onError]
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    },
    [handleFile]
  )

  const clearFile = useCallback(() => {
    setSelectedFile(null)
    setPreview(null)
  }, [])

  if (variant === 'avatar') {
    return (
      <div className={cn('relative', className)}>
        <label className="cursor-pointer">
          <div
            className={cn(
              'relative h-24 w-24 rounded-full border-2 border-dashed transition-all duration-200 flex items-center justify-center overflow-hidden',
              dragActive
                ? 'border-violet-500 bg-violet-500/10'
                : 'border-[#2a2a3e] hover:border-violet-500/50'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
{preview ? (
              <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-slate-500" />
            )}
          </div>
          <input type="file" accept={accept} onChange={handleChange} className="hidden" />
        </label>
        {selectedFile && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-1 -top-1 h-6 w-6 rounded-full"
            onClick={clearFile}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200 cursor-pointer',
          dragActive
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-[#2a2a3e] hover:border-violet-500/50 hover:bg-[#1e1e2e]'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-slate-500 mb-3" />
        <p className="text-sm font-medium text-white">
          Drag & drop or <span className="text-violet-400">browse</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">Max file size: {formatFileSize(maxSize)}</p>
        <input type="file" accept={accept} onChange={handleChange} className="hidden" />
      </label>

      {selectedFile && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1e1e2e] border border-[#2a2a3e] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
            <File className="h-5 w-5 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
            <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
