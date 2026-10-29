import { AlertCircle, ImageIcon, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

import { UploadDropzone } from '../components/upload/UploadDropzone'
import { ImagePreview } from '../components/upload/ImagePreview'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { api } from '../lib/api'
import { confidenceLabel } from '../lib/confidence'

export function DetectorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [resultMessage, setResultMessage] = useState('')
  const [forensicsReport, setForensicsReport] = useState<Record<string, unknown> | null>(null)

  const fileMeta = useMemo(() => {
    if (!selectedFile) return null
    return {
      name: selectedFile.name,
      type: selectedFile.type || 'Unknown file type',
      size: (selectedFile.size / 1024 / 1024).toFixed(2),
    }
  }, [selectedFile])

  const handleFileSelection = (file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP files are allowed in this demo environment.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('The selected file exceeds the 10MB upload limit.')
      return
    }

    setError('')
    setSelectedFile(file)
    setUploadProgress(40)
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setResultMessage('')
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreviewUrl(undefined)
    setUploadProgress(0)
    setError('')
    setResultMessage('')
    setForensicsReport(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload an image before starting analysis.')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setResultMessage('')
    setUploadProgress(5)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const response = await api.upload('/analyze', formData)
      const forensicRequest = new FormData()
      forensicRequest.append('file', selectedFile)
      const forensicResponse = await api.upload('/forensics/inspect', forensicRequest)
      setForensicsReport(forensicResponse)
      setUploadProgress(100)
      const scoreValue = response.score != null ? Number(response.score) : 0
      const prediction = response.prediction === 'ai_generated' ? 'AI-generated' : response.prediction === 'authentic' ? 'Real' : 'Inconclusive'
      setResultMessage(
        scoreValue >= 0.5 && prediction !== 'Inconclusive'
          ? `Prediction: ${prediction} · Confidence: ${confidenceLabel(scoreValue)}`
          : `Prediction: Inconclusive · Confidence: ${confidenceLabel(scoreValue)}`,
      )
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to analyze image.')
      setUploadProgress(0)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</div>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">Detector</h1>
        </div>
        <div className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-sky-100">
          Local review
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle>Image upload</CardTitle>
            <CardDescription>Drag and drop a file or use the picker to begin a review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <UploadDropzone
              selectedFile={selectedFile}
              onFileSelected={handleFileSelection}
              onRemove={handleRemove}
              uploadProgress={uploadProgress}
              error={error}
            />

            <ImagePreview previewUrl={previewUrl} fileName={selectedFile?.name} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-slate-900/80">
            <CardHeader>
              <CardTitle>Image information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fileMeta ? (
                <>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-200">
                        <ImageIcon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{fileMeta.name}</div>
                        <div className="text-xs text-slate-400">{fileMeta.type}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                      <div className="text-slate-400">File size</div>
                      <div className="mt-1 font-medium text-white">{fileMeta.size} MB</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                      <div className="text-slate-400">Resolution</div>
                      <div className="mt-1 font-medium text-white">{forensicsReport ? `${(forensicsReport.image as any)?.width ?? 'n/a'} × ${(forensicsReport.image as any)?.height ?? 'n/a'}` : 'Pending'}</div>
                    </div>
                  </div>

                  {forensicsReport ? (
                    <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-xs text-slate-300">
                      <div><span className="text-slate-400">Format:</span> {(forensicsReport.image as any)?.format ?? 'unknown'}</div>
                      <div><span className="text-slate-400">Color mode:</span> {(forensicsReport.image as any)?.mode ?? 'unknown'}</div>
                      <div><span className="text-slate-400">SHA-256:</span> {(forensicsReport.image as any)?.sha256 ?? 'not available'}</div>
                      <div className="text-amber-300">Metadata absence is not evidence of AI generation.</div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
                  Select an image to see metadata.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/80">
            <CardHeader>
              <CardTitle>Analysis controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-300">
                <div className="mb-2 flex items-center gap-2 text-slate-100">
                  <ShieldCheck size={16} className="text-green-400" />
                  Review mode: local analysis
                </div>
                <div>Predictions are estimates for human review, not definitive proof.</div>
              </div>

              {isAnalyzing ? (
                <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <Loader2 size={16} className="animate-spin" />
                    Running image analysis…
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              ) : (
                <Button type="button" className="w-full gap-2" onClick={handleAnalyze} disabled={!selectedFile}>
                  <Sparkles size={16} />
                  Analyze image
                </Button>
              )}

              {resultMessage ? (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                  <AlertCircle size={16} className="mt-0.5" />
                  {resultMessage}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
