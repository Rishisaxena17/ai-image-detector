import { AlertTriangle, ImagePlus, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void
  selectedFile?: File | null
  onRemove?: () => void
  uploadProgress?: number
  error?: string
}

export function UploadDropzone({
  onFileSelected,
  selectedFile,
  onRemove,
  uploadProgress = 0,
  error,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      onFileSelected(file)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`rounded-3xl border border-dashed p-6 transition-all duration-200 ${
          isDragging
            ? 'border-sky-400/60 bg-sky-500/5'
            : 'border-white/10 bg-slate-950/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              onFileSelected(file)
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <motion.div
            animate={{ scale: isDragging ? 1.04 : 1 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-sky-200 ring-1 ring-sky-400/20"
          >
            <ImagePlus size={28} />
          </motion.div>

          <div>
            <div className="mb-1 text-lg font-semibold text-white">
              Drag and drop image
            </div>
            <p className="text-sm text-slate-400">
              PNG, JPG, or WEBP • Max 10MB • Demo preview only
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button type="button" onClick={() => inputRef.current?.click()}>
              Choose image
            </Button>
            {selectedFile ? (
              <Button type="button" variant="outline" onClick={onRemove}>
                Remove file
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {selectedFile ? (
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-200">
              <ImagePlus size={18} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-white">{selectedFile.name}</div>
              <div className="text-xs text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Remove selected file"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      {uploadProgress > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Upload progress</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      ) : null}

      {error ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  )
}
