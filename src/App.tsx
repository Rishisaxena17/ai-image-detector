import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { DetectorPage } from './pages/DetectorPage'
import { ForensicsPage } from './pages/ForensicsPage'
import { ResultsPage } from './pages/ResultsPage'
import { HistoryPage } from './pages/HistoryPage'
import { AnalysisDetailPage } from './pages/AnalysisDetailPage'
import { MethodologyPage } from './pages/MethodologyPage'
import { PrivacyPage } from './pages/PrivacyPage'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/detector" element={<DetectorPage />} />
          <Route path="/forensics" element={<ForensicsPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
