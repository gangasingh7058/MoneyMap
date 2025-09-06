import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import backgroundImage from '../../assets/image.png'

const InvestorProfileShow = () => {
  const { mentorId } = useParams()
  const [selectedTab, setSelectedTab] = useState('overview')

  // Mock mentor data - in real app this would come from API
  const mentor = {
    id: mentorId || 1,
    name: 'Dr. Anya Sharra',
    title: 'Investment Strategist',
    avatar: '👩‍💼',
    expertise: ['Stocks', 'ETFs', 'Portfolio Management'],
    rating: 4.9,
    reviews: 127,
    experience: '15+ years',
    description: 'Dr. Anya Sharra is a seasoned investment strategist with over 15 years of experience in financial markets. She specializes in helping new investors build diversified portfolios and develop long-term investment strategies.',
    achievements: [
      'CFA Charter Holder',
      'Former Goldman Sachs Analyst',
      'Published Author - "Smart Investing for Beginners"',
      'Featured in Forbes, WSJ, Bloomberg'
    ],
    sessionTypes: [
      {
        type: 'Portfolio Review',
        duration: '60 minutes',
        price: '$150',
        description: 'Comprehensive analysis of your current investment portfolio'
      },
      {
        type: 'Investment Strategy Session',
        duration: '45 minutes',
        price: '$120',
        description: 'Develop a personalized investment strategy based on your goals'
      },
      {
        type: 'Quick Consultation',
        duration: '30 minutes',
        price: '$80',
        description: 'Quick answers to your investment questions'
      }
    ],
    availability: [
      'Monday: 9:00 AM - 5:00 PM',
      'Tuesday: 9:00 AM - 5:00 PM',
      'Wednesday: 9:00 AM - 3:00 PM',
      'Thursday: 9:00 AM - 5:00 PM',
      'Friday: 9:00 AM - 2:00 PM'
    ],
    testimonials: [
      {
        name: 'Sarah Johnson',
        rating: 5,
        text: 'Dr. Sharra helped me completely restructure my portfolio. My returns have improved by 23% since our sessions!'
      },
      {
        name: 'Mike Chen',
        rating: 5,
        text: 'Excellent mentor! Very knowledgeable and patient. Highly recommend for anyone starting their investment journey.'
      }
    ]
  }

  const handleBookSession = (sessionType) => {
    console.log('Booking session:', sessionType)
    // In real app, this would navigate to booking page or open booking modal
  }

  return (
    <div className="investor-profile">
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
            <a href="#my-sessions" className="nav-link">My Sessions</a>
            <a href="#mentors" className="nav-link nav-mentors">Mentors</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="profile-container">
          {/* Back Button */}
          <Link to="/investor/dashboard" className="back-btn">
            ← Back to Mentors
          </Link>

          {/* Profile Header */}
          <div className="profile-header">
            <div className="mentor-avatar-large">
              <div className="avatar-circle-large">
                <span className="avatar-emoji-large">{mentor.avatar}</span>
              </div>
            </div>
            <div className="mentor-details">
              <h1 className="mentor-name-large">{mentor.name}</h1>
              <p className="mentor-title-large">{mentor.title}</p>
              <div className="mentor-stats">
                <div className="stat">
                  <span className="stat-value">⭐ {mentor.rating}</span>
                  <span className="stat-label">({mentor.reviews} reviews)</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{mentor.experience}</span>
                  <span className="stat-label">Experience</span>
                </div>
              </div>
              <div className="mentor-expertise-large">
                {mentor.expertise.map((skill, index) => (
                  <span key={index} className="expertise-tag-large">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${selectedTab === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${selectedTab === 'sessions' ? 'active' : ''}`}
              onClick={() => setSelectedTab('sessions')}
            >
              Sessions
            </button>
            <button 
              className={`tab-btn ${selectedTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setSelectedTab('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {selectedTab === 'overview' && (
              <div className="overview-content">
                <div className="content-grid">
                  <div className="main-info">
                    <section className="about-section">
                      <h3>About</h3>
                      <p>{mentor.description}</p>
                    </section>

                    <section className="achievements-section">
                      <h3>Achievements & Credentials</h3>
                      <ul className="achievements-list">
                        {mentor.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <div className="sidebar-info">
                    <section className="availability-section">
                      <h3>Availability</h3>
                      <ul className="availability-list">
                        {mentor.availability.map((slot, index) => (
                          <li key={index}>{slot}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'sessions' && (
              <div className="sessions-content">
                <h3>Available Session Types</h3>
                <div className="sessions-grid">
                  {mentor.sessionTypes.map((session, index) => (
                    <div key={index} className="session-card">
                      <h4>{session.type}</h4>
                      <div className="session-details">
                        <p className="session-duration">⏱️ {session.duration}</p>
                        <p className="session-price">{session.price}</p>
                      </div>
                      <p className="session-description">{session.description}</p>
                      <button 
                        className="book-session-btn"
                        onClick={() => handleBookSession(session)}
                      >
                        Book Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="reviews-content">
                <h3>Client Reviews</h3>
                <div className="reviews-grid">
                  {mentor.testimonials.map((review, index) => (
                    <div key={index} className="review-card">
                      <div className="review-header">
                        <h4>{review.name}</h4>
                        <p className="review-text">"{review.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .investor-profile {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 100vh;
          background: #f8fafc;
          position: relative;
        }

        .investor-profile::before {
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

        .investor-profile > * {
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
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          color: #059669;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 2rem;
          transition: color 0.3s ease;
        }

        .back-btn:hover {
          color: #047857;
        }

        /* Profile Header */
        .profile-header {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .mentor-avatar-large {
          flex-shrink: 0;
        }

        .avatar-circle-large {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 6px solid #059669;
          box-shadow: 0 8px 30px rgba(5, 150, 105, 0.3);
        }

        .avatar-emoji-large {
          font-size: 4rem;
        }

        .mentor-details {
          flex: 1;
        }

        .mentor-name-large {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .mentor-title-large {
          font-size: 1.2rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .mentor-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .mentor-expertise-large {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .expertise-tag-large {
          background: #059669;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Tab Navigation */
        .tab-navigation {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .tab-btn:hover {
          color: #059669;
        }

        .tab-btn.active {
          color: #059669;
          border-bottom-color: #059669;
        }

        /* Tab Content */
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        .about-section,
        .achievements-section,
        .availability-section {
          margin-bottom: 2rem;
        }

        .about-section h3,
        .achievements-section h3,
        .availability-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .about-section p {
          color: #6b7280;
          line-height: 1.6;
          font-size: 1rem;
        }

        .achievements-list,
        .availability-list {
          list-style: none;
          padding: 0;
        }

        .achievements-list li,
        .availability-list li {
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
          color: #6b7280;
        }

        .achievements-list li:before {
          content: '✓';
          color: #059669;
          font-weight: bold;
          margin-right: 0.5rem;
        }

        /* Sessions Content */
        .sessions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .session-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .session-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .session-card h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .session-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .session-duration {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .session-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #059669;
        }

        .session-description {
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .book-session-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: 100%;
        }

        .book-session-btn:hover {
          background: #047857;
        }

        /* Reviews Content */
        .reviews-grid {
          display: grid;
          gap: 2rem;
        }

        .review-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .review-header h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .review-rating {
          font-size: 1rem;
        }

        .review-text {
          color: #6b7280;
          line-height: 1.6;
          font-style: italic;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .content-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .mentor-stats {
            justify-content: center;
          }

          .sessions-grid {
            grid-template-columns: 1fr;
          }

          .nav-container {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-menu {
            gap: 1rem;
          }

          .mentor-name-large {
            font-size: 2rem;
          }

          .avatar-circle-large {
            width: 120px;
            height: 120px;
          }

          .avatar-emoji-large {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  )
}

export default InvestorProfileShow
