import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import backgroundImage from '../../assets/image.png'

const InvestorDashboard = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])

  const filterCategories = [
    { id: 'stocks', name: 'Stocks', icon: '📈' },
    { id: 'mutual-funds', name: 'Mutual Funds', icon: '📊' },
    { id: 'ipos', name: 'IPOS', icon: '🚀' },
    { id: 'crypto', name: 'Crypto', icon: '₿' }
  ]

  const mentors = [
    {
      id: 1,
      name: 'Dr. Anya Sharra',
      title: 'Investment Strategist',
      avatar: '👩‍💼',
      expertise: ['Stocks', 'ETFs'],
      description: 'Helps new investors build tad diversified erolas yet portfolis...',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Dr. Anya Sharra',
      title: 'Investment Strategist',
      avatar: '👨‍💼',
      expertise: ['Stocks', 'ETFs'],
      description: 'Helps new investors build build diversified proas yen portfolis...',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Sve Schiial',
      title: 'Email Menseich',
      avatar: '👨‍💼',
      expertise: ['IPOS', 'ETFs'],
      description: 'Helps new investors build tuild diversified erolas yet portfolis...',
      rating: 4.7
    }
  ]

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const toggleFilter = (filterId) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const handleViewProfile = (mentorId) => {
    navigate(`/investor/profile-overview/${mentorId}`)
  }


  return (
    <div className="investor-dashboard">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <Link to="/" className="logo">
            <div className="logo-icon">🌱</div>
            <span className="logo-text">FinanceFlow</span>
          </Link>
          <nav className="nav-menu">
            <a href="#dashboard" className="nav-link active">Dashboard</a>
            <a href="#my-sessions" className="nav-link">My Sessions</a>
            <a href="#my-sessions" className="nav-link">My Sessions</a>
            <a href="#mentors" className="nav-link nav-mentors">Mentors</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-container">
          {/* Hero Section */}
          <div className="hero-section">
            <h1 className="hero-title">Browse Expert Mentors</h1>
            <p className="hero-subtitle">Your path to financial growth starts here</p>
          </div>

          <div className="content-grid">
            {/* Filter Sidebar */}
            <div className="filter-sidebar">
              <h3 className="filter-title">Filter by Expertise</h3>
              
              {/* Search Bar */}
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <div className="search-icon">🔍</div>
              </div>

              {/* Filter Categories */}
              <div className="filter-categories">
                {filterCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`filter-item ${selectedFilters.includes(category.id) ? 'active' : ''}`}
                    onClick={() => toggleFilter(category.id)}
                  >
                    <div className="filter-icon">{category.icon}</div>
                    <span className="filter-name">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="mentors-section">
              <div className="mentors-grid">
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="mentor-card">
                    <div className="mentor-avatar">
                      <div className="avatar-circle">
                        <span className="avatar-emoji">{mentor.avatar}</span>
                      </div>
                    </div>
                    <div className="mentor-info">
                      <h4 className="mentor-name">{mentor.name}</h4>
                      <p className="mentor-title">{mentor.title}</p>
                      <div className="mentor-expertise">
                        {mentor.expertise.map((skill, index) => (
                          <span key={index} className="expertise-tag">{skill}</span>
                        ))}
                      </div>
                      <p className="mentor-description">{mentor.description}</p>
                      <button 
                        onClick={() => handleViewProfile(mentor.id)}
                        className="view-profile-btn"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        .investor-dashboard {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 100vh;
          background: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
        }

        .investor-dashboard::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.85);
          z-index: 1;
        }

        .investor-dashboard > * {
          position: relative;
          z-index: 2;
        }

        /* Header Styles */
        .header {
          background: white;
          padding: 1rem 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: bold;
          color: #059669;
          text-decoration: none;
        }

        .logo-icon {
          font-size: 1.8rem;
        }

        .nav-menu {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          text-decoration: none;
          color: #6b7280;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #059669;
          background: #f0fdf4;
        }

        .nav-mentors {
          background: #059669;
          color: white;
        }

        .nav-mentors:hover {
          background: #047857;
          color: white;
        }

        /* Main Content */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .dashboard-container {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .dashboard-container::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          opacity: 0.8;
          z-index: 1;
        }

        .dashboard-container > * {
          position: relative;
          z-index: 2;
        }

        /* Hero Section */
        .hero-section {
          margin-bottom: 2rem;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: #059669;
          margin: 0;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        /* Filter Sidebar */
        .filter-sidebar {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 12px;
          height: fit-content;
        }

        .filter-title {
          font-size: 1.1rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .search-container {
          position: relative;
          margin-bottom: 2rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .search-icon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .filter-categories {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-item:hover {
          background: #e5e7eb;
        }

        .filter-item.active {
          background: #059669;
          color: white;
        }

        .filter-icon {
          width: 32px;
          height: 32px;
          background: #059669;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .filter-item.active .filter-icon {
          background: white;
        }

        .filter-name {
          font-weight: 500;
          font-size: 0.875rem;
        }

        /* Mentors Section */
        .mentors-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 900px;
        }

        .mentor-card {
          background: white;
          border: none;
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .mentor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .mentor-avatar {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .avatar-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 4px solid #059669;
          box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
        }

        .avatar-emoji {
          font-size: 2.5rem;
        }

        .mentor-info {
          text-align: center;
        }

        .mentor-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .mentor-title {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 1.2rem;
          font-weight: 500;
        }

        .mentor-expertise {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.2rem;
          flex-wrap: wrap;
        }

        .expertise-tag {
          background: #059669;
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mentor-description {
          color: #6b7280;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 1.8rem;
          min-height: 60px;
        }

        .view-profile-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .view-profile-btn:hover {
          background: #047857;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4);
        }


        /* Responsive Design */
        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .nav-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-menu {
            gap: 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .mentors-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default InvestorDashboard
