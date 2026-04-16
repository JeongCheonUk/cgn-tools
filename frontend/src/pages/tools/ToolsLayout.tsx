import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import './ToolsLayout.css'

function ToolsLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false)

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (location.pathname === '/') {
      window.location.reload()
    } else {
      navigate('/')
    }
  }

  return (
    <div className="tools-app">
      <nav className="tools-nav">
        <div className="tools-nav-container">
          <div className="tools-nav-left">
            <Link to="/" className="tools-nav-title-link" onClick={handleLogoClick}>
              <h1 className="tools-nav-title">CGN Tools</h1>
            </Link>
          </div>
          <div className="tools-nav-links">
            <Link to="/" className={`tools-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              📺 모니터링
            </Link>
            <Link to="/generator" className={`tools-nav-link ${location.pathname === '/generator' ? 'active' : ''}`}>
              🔗 경로 생성
            </Link>
            <Link to="/upload" className={`tools-nav-link ${location.pathname === '/upload' ? 'active' : ''}`}>
              📤 이미지 업로드
            </Link>
            <Link to="/parser" className={`tools-nav-link ${location.pathname === '/parser' ? 'active' : ''}`}>
              📖 본문 파싱
            </Link>
            <div
              className="tools-nav-dropdown"
              onMouseEnter={() => setShowScheduleDropdown(true)}
              onMouseLeave={() => setShowScheduleDropdown(false)}
            >
              <span className="tools-nav-link">📋 편성표 ▼</span>
              {showScheduleDropdown && (
                <div className="tools-dropdown-menu">
                  <a href="https://docs.google.com/spreadsheets/d/1AUD9xCWqgy-X4rjcqatrDo-HS-ZnNDizrqXWtZIRz84/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="tools-dropdown-item">
                    S3 편성표
                  </a>
                  <a href="https://docs.google.com/spreadsheets/d/1ZNTpy1zuyqcHl37Xud8UUgNMt5X9WmcbWNkqwierofo/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="tools-dropdown-item">
                    퐁당 편성표
                  </a>
                  <a href="https://docs.google.com/spreadsheets/d/1AV9CzlUxa207BWK8fzsu4md84gOdvI4IgVzLcCW5z0Q/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="tools-dropdown-item">
                    예배 현황표
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="tools-container">
        <Outlet />
      </div>
    </div>
  )
}

export default ToolsLayout
