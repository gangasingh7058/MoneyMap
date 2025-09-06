import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import backgroundImage from '../../assets/image.png'

const MentorDashboard = () => {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    tags: [],
    sebiId: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const API_BASE_URL = 'http://localhost:8000/api'

  const [sessionData, setSessionData] = useState({
    selectedDate: null,
    selectedTime: '',
    topic: '',
    description: ''
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState([])

  const [bookings, setBookings] = useState([])
  const [sessions, setSessions] = useState([])

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

  const handleDateSelect = (date) => {
    setSessionData(prev => ({
      ...prev,
      selectedDate: date
    }))
    
    // Toggle date selection for visual feedback
    setSelectedDates(prev => {
      const dateStr = date.toDateString()
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr)
      } else {
        return [dateStr] // Only allow single date selection
      }
    })
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const today = new Date()
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = date.getMonth() === month
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = selectedDates.includes(date.toDateString())
      const isPast = date < today && !isToday
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isPast
      })
    }
    
    return days
  }

  const timeSlots = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ]

  const handleCreateSession = async () => {
    if (!sessionData.selectedDate || !sessionData.selectedTime || !sessionData.topic || !sessionData.description) {
      setError('Please select date, time, topic and description')
      return
    }

    try {
      const token = localStorage.getItem('mentorToken')
      if (!token) {
        navigate('/mentor/signin')
        return
      }

      console.log('Creating session with data:', {
        selectedDate: sessionData.selectedDate,
        selectedTime: sessionData.selectedTime,
        topic: sessionData.topic,
        description: sessionData.description
      })

      // Combine selected date and time
      const [hours, minutes] = sessionData.selectedTime.split(':')
      const startDateTime = new Date(sessionData.selectedDate)
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      
      const endDateTime = new Date(startDateTime)
      endDateTime.setHours(startDateTime.getHours() + 1) // 1 hour session

      console.log('Sending to backend:', {
        token,
        title: sessionData.topic,
        description: sessionData.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      })

      const { data } = await axios.post(`${API_BASE_URL}/mentor/live-session`, {
        token,
        title: sessionData.topic,
        description: sessionData.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      })

      console.log('Backend response:', data)

      if (data.success) {
        setSessionData({ selectedDate: null, selectedTime: '', topic: '', description: '' })
        setSelectedDates([])
        fetchSessions() // Refresh sessions
        setError('')
        alert('Session created successfully!')
      } else {
        setError(data.msg || 'Failed to create session')
      }
    } catch (error) {
      console.error('Session creation error:', error)
      console.error('Error details:', error.response?.data)
      setError(error.response?.data?.msg || 'Network error. Please try again.')
    }
  }

  const handleUploadVideo = () => {
    console.log('Upload video clicked')
  }

  const handleLinkYouTube = () => {
    console.log('Link YouTube video clicked')
  }

  const fetchMentorProfile = async () => {
    try {
      const token = localStorage.getItem('mentorToken')
      if (!token) {
        navigate('/mentor/signin')
        return
      }

      const { data } = await axios.get(`${API_BASE_URL}/mentor/name/${token}`)
      
      if (data.success) {
        setProfileData({
          name: data.user.name || '',
          bio: data.user.bio || '',
          tags: data.user.expertises ? data.user.expertises.map(exp => `#${exp.name}`) : [],
          sebiId: data.user.sebi_id || ''
        })
      } else {
        setError(data.msg || 'Failed to fetch profile')
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('mentorToken')
        navigate('/mentor/signin')
      } else {
        setError(error.response?.data?.msg || 'Network error')
      }
    }
  }

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('mentorToken')
      if (!token) return

      const { data } = await axios.get(`${API_BASE_URL}/mentor/booking`, {
        headers: { token }
      })
      
      if (data.success) {
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Bookings fetch error:', error)
    }
  }

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('mentorToken')
      if (!token) return

      // Get mentor ID from token first
      const profileResponse = await axios.get(`${API_BASE_URL}/mentor/name/${token}`)
      if (profileResponse.data.success) {
        const mentorId = profileResponse.data.user.id
        const { data } = await axios.get(`${API_BASE_URL}/mentor/sessions/${mentorId}`)
        
        if (data.success) {
          setSessions(data.sessions || [])
        }
      }
    } catch (error) {
      console.error('Sessions fetch error:', error)
    }
  }

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true)
      await fetchMentorProfile()
      await fetchBookings()
      await fetchSessions()
      setLoading(false)
    }

    initializeDashboard()
  }, [])

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
          </nav>
          <div className="profile-section">
            <div className="profile-avatar">👨‍💼</div>
            <span className="profile-name">{profileData.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {loading && <div className="loading-message">Loading dashboard...</div>}
        {error && <div className="error-message">{error}</div>}
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
            <div className="tags-container">
              {profileData.tags.length > 0 ? (
                profileData.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))
              ) : (
                <span className="no-tags">No expertise tags set</span>
              )}
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
                  <div className="month-navigation">
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="nav-btn"
                    >
                      ←
                    </button>
                    <span className="month-year">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="nav-btn"
                    >
                      →
                    </button>
                  </div>
                </div>
                <div className="days-header">
                  <div className="day-header">Sun</div>
                  <div className="day-header">Mon</div>
                  <div className="day-header">Tue</div>
                  <div className="day-header">Wed</div>
                  <div className="day-header">Thu</div>
                  <div className="day-header">Fri</div>
                  <div className="day-header">Sat</div>
                </div>
                <div className="calendar-grid">
                  {generateCalendarDays().map((dayObj, index) => (
                    <div
                      key={index}
                      className={`calendar-day ${
                        dayObj.isCurrentMonth ? '' : 'other-month'
                      } ${
                        dayObj.isToday ? 'today' : ''
                      } ${
                        dayObj.isSelected ? 'selected' : ''
                      } ${
                        dayObj.isPast ? 'past' : ''
                      }`}
                      onClick={() => !dayObj.isPast && dayObj.isCurrentMonth && handleDateSelect(dayObj.date)}
                    >
                      {dayObj.day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="session-form">
              <div className="form-group">
                <label className="form-label">Selected Date:</label>
                <div className="selected-date">
                  {sessionData.selectedDate ? 
                    sessionData.selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 
                    'Please select a date from calendar'
                  }
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Time Slot (24-hour format):</label>
                <div className="time-slot-container">
                  <select
                    name="selectedTime"
                    value={sessionData.selectedTime}
                    onChange={handleSessionChange}
                    className="form-select time-dropdown"
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time} - {time === '23:00' ? '00:00' : String(parseInt(time.split(':')[0]) + 1).padStart(2, '0') + ':00'}</option>
                    ))}
                  </select>
                </div>
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


          {/* Scheduled Sessions Card */}
          <div className="card sessions-card">
            <h3 className="card-title">Your Scheduled Sessions</h3>
            <div className="sessions-list">
              {sessions.length === 0 ? (
                <div className="no-sessions">No sessions scheduled yet</div>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="session-item">
                    <div className="session-icon">📅</div>
                    <div className="session-info">
                      <div className="session-title">{session.title}</div>
                      <div className="session-time">
                        {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>
                      <div className="session-description">{session.description}</div>
                    </div>
                    <div className="session-status">
                      {session.isLive ? 'Live' : 'Scheduled'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* One-to-One Bookings Card */}
          <div className="card bookings-card">
            <h3 className="card-title">One-to-One Bookings</h3>
            <div className="bookings-list">
              {bookings.length === 0 ? (
                <div className="no-bookings">No bookings yet</div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-avatar">👤</div>
                    <div className="booking-info">
                      <div className="booking-name">Booking #{booking.id}</div>
                      <div className="booking-date">{new Date(booking.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className={`booking-status ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </div>
                  </div>
                ))
              )}
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
          gap: 0.5rem;
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

        .profile-name {
          font-weight: 600;
          color: #1f2937;
        }

        .loading-message, .error-message {
          text-align: center;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 8px;
        }

        .loading-message {
          background: #e0f2fe;
          color: #0277bd;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
        }

        .no-bookings, .no-tags, .no-sessions {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          padding: 2rem;
        }

        /* Sessions Card */
        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .session-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border-radius: 8px;
          background: #f9fafb;
          border-left: 4px solid #059669;
        }

        .session-icon {
          font-size: 1.5rem;
          margin-top: 0.25rem;
        }

        .session-info {
          flex: 1;
        }

        .session-title {
          font-weight: 600;
          color: #1f2937;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .session-time {
          color: #059669;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .session-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .session-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          background: #d1fae5;
          color: #065f46;
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
          grid-template-rows: auto auto auto;
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
          grid-row: 1 / 4;
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
          margin-bottom: 1rem;
        }

        .calendar {
          background: #f9fafb;
          border-radius: 6px;
          padding: 0.75rem;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .calendar-header {
          margin-bottom: 0.5rem;
        }

        .month-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .nav-btn {
          background: #059669;
          color: white;
          border: none;
          border-radius: 3px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.3s ease;
        }

        .nav-btn:hover {
          background: #047857;
        }

        .month-year {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1f2937;
        }

        .days-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.4rem;
          margin-bottom: 0.4rem;
        }

        .day-header {
          text-align: center;
          font-size: 0.65rem;
          font-weight: 600;
          color: #6b7280;
          padding: 0.125rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.4rem;
        }

        .calendar-day {
          text-align: center;
          padding: 0.4rem 0.25rem;
          font-size: 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          min-height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .calendar-day:hover:not(.past):not(.other-month) {
          background: #e5e7eb;
        }

        .calendar-day.today {
          background: #dbeafe;
          color: #1e40af;
          font-weight: 600;
        }

        .calendar-day.selected {
          background: #059669;
          color: white;
          font-weight: 600;
        }

        .calendar-day.past {
          color: #9ca3af;
          cursor: not-allowed;
        }

        .calendar-day.other-month {
          color: #d1d5db;
          cursor: not-allowed;
        }

        .selected-date {
          padding: 0.5rem;
          background: #f3f4f6;
          border-radius: 4px;
          color: #1f2937;
          font-weight: 500;
          font-size: 0.875rem;
          min-height: 16px;
        }

        .time-slot-container {
          position: relative;
        }

        .time-dropdown {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
          max-height: 200px;
          overflow-y: auto;
        }

        .time-dropdown:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .time-dropdown option {
          padding: 0.75rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .time-dropdown option:hover {
          background: #f3f4f6;
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
