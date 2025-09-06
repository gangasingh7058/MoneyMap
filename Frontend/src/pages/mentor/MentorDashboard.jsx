import { useState } from 'react'
import { Link } from 'react-router-dom'
import backgroundImage from '../../assets/image.png'

const MentorDashboard = () => {
  const [profileData, setProfileData] = useState({
    name: 'Suine',
    bio: '',
    tags: ['#MutualFunds', '#StockPicking', '#ETFs', '#ETFs'],
    sebiId: ''
  })

  const [sessionData, setSessionData] = useState({
    videoLink: '',
    dateTime: '',
    topic: '',
    description: ''
  })

  const [bookings] = useState([
    { id: 1, name: 'Maria R.', date: 'Dec 16, 10:30 AM', status: 'Confirmed', avatar: '👩‍💼' },
    { id: 2, name: 'Maria R.', date: 'Dec 16, 10:30 AM', status: 'Confirmed', avatar: '👩‍💼' },
    { id: 3, name: 'David K.', date: 'Dec 16, 10:30 AM', status: 'Confirmed', avatar: '👨‍💼' },
    { id: 4, name: 'Sarah L.', date: 'Dec 16, 10:30 AM', status: 'Pending', avatar: '👩‍💼' },
    { id: 5, name: 'Sarah L.', date: 'Dec 16, 10:30 AM', status: 'Confirmed', avatar: '👩‍💼' }
  ])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSessionChange = (e) => {
    const { name, value } = e.target
    setSessionData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateSession = () => {
    console.log('Creating session:', sessionData)
  }

  const handleUploadVideo = () => {
    console.log('Upload video clicked')
  }

  const handleLinkYouTube = () => {
    console.log('Link YouTube video clicked')
  }

  return (
    <div className="mentor-dashboard">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <Link to="/" className="logo">
            <div className="logo-icon">🌱</div>
            <span className="logo-text">FinanceFlow</span>
          </Link>
          <nav className="nav-menu">
            <a href="#learn" className="nav-link">Learn</a>
            <a href="#mentor" className="nav-link">Mentor</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </nav>
          <div className="profile-section">
            <div className="profile-avatar">👨‍💼</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-container">
          {/* Introductory Video Card - Now Full Height */}
          <div className="card video-card-full">
            <h3 className="card-title">Introductory Video</h3>
            <div className="video-player">
              <div className="video-placeholder">
                <div className="play-button">▶</div>
              </div>
              <div className="video-controls">
                <div className="control-left">
                  <span className="play-icon">▶</span>
                  <span className="next-icon">⏭</span>
                  <span className="time">10:9:38</span>
                </div>
                <div className="control-right">
                  <span className="settings-icon">⚙</span>
                  <span className="fullscreen-icon">⛶</span>
                </div>
              </div>
            </div>
            <div className="video-actions">
              <button onClick={handleUploadVideo} className="upload-video-btn">
                Upload Video
              </button>
              <button onClick={handleLinkYouTube} className="link-youtube-btn">
                Link YouTube Video
              </button>
            </div>
            <div className="investor-description">
              <h4 className="description-title">About Our Investors</h4>
              <p className="description-text">
                "Passionate about exploring new investment opportunities, I'm a young investor eager to build a strong financial future. With a keen interest in stock markets, mutual funds, and emerging tech startups, I aim to learn from industry experts and apply proven strategies to grow my portfolio. My goal is to make informed decisions, manage risks wisely, and unlock long-term wealth through continuous learning and smart investments."
              </p>
            </div>
          </div>

          {/* Schedule Live Session Card */}
          <div className="card session-card">
            <h3 className="card-title">Schedule Live Session</h3>
            <div className="calendar-section">
              <div className="calendar">
                <div className="calendar-header">
                  <div className="day-header">Sun</div>
                  <div className="day-header">Mon</div>
                  <div className="day-header">Mo</div>
                  <div className="day-header">Tu</div>
                  <div className="day-header">We</div>
                  <div className="day-header">Th</div>
                  <div className="day-header">Fr</div>
                  <div className="day-header">Sa</div>
                </div>
                <div className="calendar-grid">
                  <div className="calendar-day"></div>
                  <div className="calendar-day">1</div>
                  <div className="calendar-day active">2</div>
                  <div className="calendar-day">3</div>
                  <div className="calendar-day">4</div>
                  <div className="calendar-day selected">5</div>
                  <div className="calendar-day">6</div>
                  <div className="calendar-day">7</div>
                </div>
              </div>
            </div>
            <div className="session-form">
              <div className="form-group">
                <input
                  type="text"
                  name="videoLink"
                  value={sessionData.videoLink}
                  onChange={handleSessionChange}
                  className="form-input"
                  placeholder="Video Link"
                />
              </div>
              <div className="form-group">
                <select
                  name="dateTime"
                  value={sessionData.dateTime}
                  onChange={handleSessionChange}
                  className="form-select"
                >
                  <option value="">Date & Time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="topic"
                  value={sessionData.topic}
                  onChange={handleSessionChange}
                  className="form-input"
                  placeholder="Topic"
                />
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  value={sessionData.description}
                  onChange={handleSessionChange}
                  className="form-textarea"
                  placeholder="Description"
                  rows="3"
                />
              </div>
              <button onClick={handleCreateSession} className="create-session-btn">
                Create Session
              </button>
            </div>
          </div>


          {/* One-to-One Bookings Card */}
          <div className="card bookings-card">
            <h3 className="card-title">One-to-One Bookings</h3>
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-avatar">{booking.avatar}</div>
                  <div className="booking-info">
                    <div className="booking-name">{booking.name}</div>
                    <div className="booking-date">{booking.date}</div>
                  </div>
                  <div className={`booking-status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .mentor-dashboard {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(243, 244, 246, 0.9) 0%, rgba(229, 231, 235, 0.9) 100%), url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
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
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #059669;
        }

        .profile-section {
          display: flex;
          align-items: center;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        /* Main Content */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .dashboard-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 2rem;
        }

        .card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        /* Video Card Full Height */
        .video-card-full {
          grid-row: 1 / 3;
        }

        /* Profile Card */
        .profile-content {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .profile-avatar-large {
          flex-shrink: 0;
        }

        .avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #6b7280;
        }

        .plus-icon {
          width: 40px;
          height: 40px;
          background: #374151;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .profile-form {
          flex: 1;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #059669;
        }

        .detailed-bio-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          background: #374151;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        /* Session Card */
        .calendar-section {
          margin-bottom: 1.5rem;
        }

        .calendar {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
        }

        .calendar-header {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .day-header {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          padding: 0.25rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.5rem;
        }

        .calendar-day {
          text-align: center;
          padding: 0.5rem;
          font-size: 0.875rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .calendar-day:hover {
          background: #e5e7eb;
        }

        .calendar-day.active {
          background: #059669;
          color: white;
        }

        .calendar-day.selected {
          background: #10b981;
          color: white;
        }

        .create-session-btn {
          width: 100%;
          padding: 0.75rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .create-session-btn:hover {
          background: #047857;
        }

        /* Video Card */
        .video-player {
          margin-bottom: 1.5rem;
        }

        .video-placeholder {
          width: 100%;
          height: 200px;
          background: #1f2937;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .play-button {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #1f2937;
          cursor: pointer;
        }

        .video-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: #1f2937;
          border-radius: 0 0 8px 8px;
          color: white;
          font-size: 0.875rem;
        }

        .control-left,
        .control-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .video-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .upload-video-btn,
        .link-youtube-btn {
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .upload-video-btn {
          background: #059669;
          color: white;
        }

        .upload-video-btn:hover {
          background: #047857;
        }

        .link-youtube-btn {
          background: #f3f4f6;
          color: #1f2937;
        }

        .link-youtube-btn:hover {
          background: #e5e7eb;
        }

        /* Investor Description */
        .investor-description {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .description-title {
          font-size: 1.1rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .description-text {
          color: #4b5563;
          line-height: 1.6;
          font-size: 0.95rem;
          margin: 0;
          font-style: italic;
        }

        /* Bookings Card */
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .booking-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 8px;
          background: #f9fafb;
        }

        .booking-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .booking-info {
          flex: 1;
        }

        .booking-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.875rem;
        }

        .booking-date {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .booking-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .booking-status.confirmed {
          background: #d1fae5;
          color: #065f46;
        }

        .booking-status.pending {
          background: #dbeafe;
          color: #1e40af;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-container {
            grid-template-columns: 1fr;
          }
          
          .nav-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-menu {
            gap: 1rem;
          }

          .profile-content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default MentorDashboard
