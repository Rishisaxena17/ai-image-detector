import { ImageOff } from 'lucide-react'

interface ImagePreviewProps {
  previewUrl?: string
  fileName?: string
}

export function ImagePreview({ previewUrl, fileName }: ImagePreviewProps) {
  if (!previewUrl) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center text-slate-500">
        <div className="space-y-3 p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
            <ImageOff size={28} />
          </div>
          <div>
            <div className="font-medium text-slate-800">No image selected</div>
            <div className="text-sm">Upload a file to inspect the preview.</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-3">
      <img
        src={previewUrl}
        alt={fileName ?? 'Selected upload preview'}
        className="h-[420px] w-full rounded-2xl object-cover"
      />
    </div>
  )
}
