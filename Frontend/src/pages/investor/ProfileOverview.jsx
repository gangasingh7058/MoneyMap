import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import backgroundImage from '../../assets/image.png'

const ProfileOverview = () => {
  const { mentorId } = useParams()
  const navigate = useNavigate()
  
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_BASE_URL = 'http://localhost:8000/api'

  // Fetch mentor data on component mount
  useEffect(() => {
    fetchMentorData()
  }, [mentorId])

  const fetchMentorData = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch mentor details
      const mentorResponse = await axios.get(`${API_BASE_URL}/mentor/${mentorId}`)
      
      if (mentorResponse.data.success) {
        const mentorData = mentorResponse.data.mentor
        
        // Fetch mentor's live sessions
        try {
          const sessionsResponse = await axios.get(`${API_BASE_URL}/mentor/sessions/${mentorId}`)
          if (sessionsResponse.data.success) {
            mentorData.upcomingSessions = sessionsResponse.data.sessions
          } else {
            mentorData.upcomingSessions = []
          }
        } catch (sessionError) {
          console.warn('Could not fetch sessions:', sessionError)
          mentorData.upcomingSessions = []
        }
        
        setMentor(mentorData)
      } else {
        setError(mentorResponse.data.msg || 'Mentor not found')
      }
    } catch (error) {
      console.error('Error fetching mentor:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinSession = (session) => {
    console.log('Joining session:', session)
  }

  const handleBookSession = () => {
    navigate(`/investor/booking/${mentorId}`)
  }

  if (loading) {
    return (
      <div className="profile-overview">
        <div className="loading-container">
          <div className="loading-message">Loading mentor profile...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-overview">
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/investor/dashboard')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="profile-overview">
        <div className="error-container">
          <div className="error-message">Mentor not found</div>
          <button onClick={() => navigate('/investor/dashboard')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-overview">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <Link to="/" className="logo">
            <div className="logo-icon">🌱</div>
            <span className="logo-text">FinanceFlow</span>
          </Link>
          <nav className="nav-menu">
            <Link to="/investor/dashboard" className="nav-link">Dashboard</Link>
            <a href="#my-sessions" className="nav-link">My Sessions</a>
            <a href="#mentors" className="nav-link nav-mentors">Mentors</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="profile-container">
          <div className="content-layout">
            {/* Left Side - Profile Info */}
            <div className="profile-info">
              <div className="mentor-avatar">
                <div className="avatar-placeholder">👨‍💼</div>
              </div>
              
              <div className="mentor-details">
                <h1 className="mentor-name">{mentor.name}</h1>
                <p className="mentor-title">Investment Mentor</p>
                
                <div className="expertise-tags">
                  {mentor.expertises?.map((expertise, index) => (
                    <span key={index} className="expertise-tag">{expertise.name}</span>
                  ))}
                </div>

                <div className="about-section">
                  <h3>About Me</h3>
                  <p>{mentor.bio || 'Experienced investment mentor ready to help you grow your portfolio.'}</p>
                </div>
                
                <div className="sebi-section">
                  <h3>SEBI Registration</h3>
                  <p><strong>SEBI ID:</strong> {mentor.sebi_id}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Video and Sessions */}
            <div className="video-sessions">
              {/* Meet Your Mentor Section */}
              <div className="meet-mentor-section">
                <h2>Meet Your Mentor</h2>
                
                <div className="video-container">
                  <div className="video-placeholder">
                    <div className="play-button">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <circle cx="30" cy="30" r="30" fill="white" fillOpacity="0.9"/>
                        <path d="M25 20L40 30L25 40V20Z" fill="#059669"/>
                      </svg>
                    </div>
                    <div className="video-overlay">
                      <span className="video-label">Introductory Video</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Live Sessions */}
              <div className="sessions-section">
                <h3>Upcoming Live Sessions</h3>
                
                <div className="sessions-list">
                  {mentor.upcomingSessions && mentor.upcomingSessions.length > 0 ? (
                    mentor.upcomingSessions.map((session, index) => (
                      <div key={session.id || index} className="session-item">
                        <div className="session-info">
                          <h4 className="session-title">{session.title}</h4>
                          <p className="session-date">
                            {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString()}
                          </p>
                          <p className="session-description">{session.description}</p>
                        </div>
                        <button 
                          className="join-session-btn"
                          onClick={() => handleJoinSession(session)}
                        >
                          Join Session
                        </button>
                        <div className="session-arrow">›</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-sessions">
                      <p>No upcoming live sessions scheduled.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Book Session Button */}
          <div className="book-session-section">
            <button 
              className="book-session-btn"
              onClick={handleBookSession}
            >
              Book One-to-One Session
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        .profile-overview {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 100vh;
          background: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
        }

        .profile-overview::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.85);
          z-index: 1;
        }

        .profile-overview > * {
          position: relative;
          z-index: 2;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
        }

        .loading-message {
          font-size: 1.2rem;
          color: #6b7280;
        }

        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem 2rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .back-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .back-btn:hover {
          background: #047857;
        }

        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: white;
          margin: 0 auto 1.5rem;
        }

        .sebi-section {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .sebi-section h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .sebi-section p {
          margin: 0;
          color: #374151;
          font-size: 0.9rem;
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

        .nav-link:hover {
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

        .profile-container {
          background: white;
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }

        /* Profile Info */
        .profile-info {
          display: flex;
          flex-direction: column;
        }

        .mentor-avatar {
          margin-bottom: 2rem;
        }

        .avatar-image {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          object-fit: cover;
          border: 6px solid #059669;
          box-shadow: 0 8px 30px rgba(5, 150, 105, 0.3);
        }

        .mentor-name {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .mentor-title {
          font-size: 1.1rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .expertise-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
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
        }

        .about-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .about-section p {
          color: #6b7280;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        /* Video and Sessions */
        .video-sessions {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .meet-mentor-section h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .video-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .video-placeholder {
          width: 100%;
          height: 250px;
          background: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-placeholder::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .play-button {
          position: relative;
          z-index: 2;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .play-button:hover {
          transform: scale(1.1);
        }

        .video-overlay {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          z-index: 2;
        }

        .video-label {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Sessions Section */
        .sessions-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .session-item {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .session-item:hover {
          background: #f3f4f6;
          transform: translateX(4px);
        }

        .session-info {
          flex: 1;
        }

        .session-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .session-date {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 0.5rem 0;
        }

        .session-description {
          font-size: 0.8rem;
          color: #9ca3af;
          margin: 0;
          line-height: 1.4;
        }

        .no-sessions {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
          font-style: italic;
        }

        .no-sessions p {
          margin: 0;
        }

        .join-session-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-right: 1rem;
        }

        .join-session-btn:hover {
          background: #047857;
        }

        .session-arrow {
          font-size: 1.5rem;
          color: #9ca3af;
          font-weight: 300;
        }

        /* Book Session Button */
        .book-session-section {
          display: flex;
          justify-content: center;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .book-session-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 1rem 3rem;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .book-session-btn:hover {
          background: #047857;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(5, 150, 105, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .content-layout {
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

          .mentor-name {
            font-size: 1.75rem;
          }

          .avatar-image {
            width: 150px;
            height: 150px;
          }

          .video-placeholder {
            height: 200px;
          }

          .session-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .join-session-btn {
            margin-right: 0;
            width: 100%;
          }

          .session-arrow {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

export default ProfileOverview
