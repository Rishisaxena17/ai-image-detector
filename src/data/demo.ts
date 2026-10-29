import type { AnalysisDetail, AnalysisRecord, DemoInsight, UserProfile } from '../types'

export const currentUser: UserProfile = {
  id: 'user-001',
  name: 'Alex Morgan',
  email: 'alex@veritasai.app',
  role: 'analyst',
}

export const dashboardInsights: DemoInsight[] = [
  {
    label: 'Images reviewed',
    value: '184',
    hint: 'Across the last 30 days',
  },
  {
    label: 'Average confidence',
    value: '81%',
    hint: 'Based on recent sample cases',
  },
  {
    label: 'Flagged for review',
    value: '12',
    hint: 'Requires analyst attention',
  },
]

export const sampleHistory: AnalysisRecord[] = [
  {
    id: 'an-1042',
    title: 'Social post evidence',
    status: 'completed',
    label: 'ai_generated',
    confidence: 0.88,
    createdAt: '2026-10-28T10:42:00Z',
    fileName: 'campaign-image-7.jpg',
    fileType: 'JPG',
    model: 'VERITAS Vision 2.1',
    notes: 'Demo preview only — no real model result',
  },
  {
    id: 'an-1036',
    title: 'Field image review',
    status: 'completed',
    label: 'authentic',
    confidence: 0.76,
    createdAt: '2026-10-27T16:12:00Z',
    fileName: 'museum-photo.png',
    fileType: 'PNG',
    model: 'VERITAS Vision 2.1',
    notes: 'Sample image for interface testing',
  },
  {
    id: 'an-1028',
    title: 'Event photography check',
    status: 'processing',
    label: 'uncertain',
    confidence: 0.61,
    createdAt: '2026-10-27T11:04:00Z',
    fileName: 'event-scene.webp',
    fileType: 'WEBP',
    model: 'VERITAS Vision 2.1',
    notes: 'Processing queued for review',
  },
  {
    id: 'an-1019',
    title: 'Portrait image classification',
    status: 'failed',
    label: 'uncertain',
    confidence: 0.42,
    createdAt: '2026-10-25T17:30:00Z',
    fileName: 'portrait-study.png',
    fileType: 'PNG',
    model: 'VERITAS Vision 2.1',
    notes: 'Sample failure state for UX review',
  },
]

export const sampleDetail: AnalysisDetail = {
  id: 'an-1042',
  title: 'Social post evidence',
  status: 'completed',
  label: 'ai_generated',
  confidence: 0.88,
  createdAt: '2026-10-28T10:42:00Z',
  fileName: 'campaign-image-7.jpg',
  fileType: 'JPG',
  model: 'VERITAS Vision 2.1',
  notes: 'Demo preview only — not a production inference result.',
  summary:
    'The current preview indicates a likely AI-generated artifact profile, but this is only a sample interface result intended to demonstrate product design and reporting flow.',
  riskScore: 82,
  artifacts: [
    { label: 'Image source', value: 'Uploaded from local demo preview' },
    { label: 'Prediction', value: 'AI-generated likelihood' },
    { label: 'Confidence', value: '88%' },
  ],
  evidence: [
    {
      label: 'Texture consistency',
      value: 'Minor noise smoothing may suggest synthetic generation patterns.',
      tone: 'warning',
    },
    {
      label: 'Edge definition',
      value: 'Edges remain sharp but can appear stylized in synthetic media.',
      tone: 'neutral',
    },
    {
      label: 'Background detail',
      value: 'Background features appear locally consistent with a generated scene.',
      tone: 'positive',
    },
  ],
}
