'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

interface PDFViewerProps {
  url: string
}

export function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [isLoading, setIsLoading] = useState(true)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5))

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 p-2 bg-[#2a2a3e] rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="text-slate-300 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-slate-300 text-sm px-2">
          Page {pageNumber} of {numPages || '...'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextPage}
          disabled={pageNumber >= (numPages || 1)}
          className="text-slate-300 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-[#3a3a4e] mx-2" />
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomOut}
          disabled={scale <= 0.5}
          className="text-slate-300 hover:text-white"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-slate-300 text-sm px-2">{Math.round(scale * 100)}%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomIn}
          disabled={scale >= 2.5}
          className="text-slate-300 hover:text-white"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-auto max-h-[70vh] w-full flex justify-center bg-[#16161e] rounded-lg p-4">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            </div>
          }
          error={
            <div className="text-center py-20 text-slate-400">
              Failed to load PDF. Please try downloading the file.
            </div>
          }
        >
          {!isLoading && (
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          )}
        </Document>
      </div>
    </div>
  )
}
