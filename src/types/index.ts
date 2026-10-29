export type AnalysisStatus = 'completed' | 'processing' | 'queued' | 'failed'

export type PredictionLabel = 'authentic' | 'ai_generated' | 'uncertain'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'analyst' | 'admin'
}

export interface UploadedImage {
  id: string
  name: string
  type: string
  size: number
  width: number
  height: number
  previewUrl?: string
  uploadedAt: string
}

export interface AnalysisRecord {
  id: string
  title: string
  status: AnalysisStatus
  label: PredictionLabel
  confidence: number
  createdAt: string
  fileName: string
  fileType: string
  model: string
  notes?: string
}

export interface DemoInsight {
  label: string
  value: string
  hint: string
}

export interface AnalysisDetail extends AnalysisRecord {
  summary: string
  riskScore: number
  artifacts: {
    label: string
    value: string
  }[]
  evidence: {
    label: string
    value: string
    tone: 'positive' | 'neutral' | 'warning'
  }[]
}
