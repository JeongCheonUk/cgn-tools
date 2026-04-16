import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ToolsLayout from './pages/tools/ToolsLayout'
import MonitoringPage from './pages/tools/MonitoringPage'
import PathGeneratorPage from './pages/tools/PathGeneratorPage'
import ImageUploadPage from './pages/tools/ImageUploadPage'
import TextParserPage from './pages/tools/TextParserPage'
import './styles/index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tools" replace />} />
        <Route path="/tools" element={<ToolsLayout />}>
          <Route index element={<MonitoringPage />} />
          <Route path="generator" element={<PathGeneratorPage />} />
          <Route path="upload" element={<ImageUploadPage />} />
          <Route path="parser" element={<TextParserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
