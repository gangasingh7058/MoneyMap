import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import backgroundImage from '../../assets/image.png'

const OneToOneBooking = () => {
  const { mentorId } = useParams()
  const [selectedDate, setSelectedDate] = useState(9)
  const [selectedTime, setSelectedTime] = useState('10:30 AM')
  const [promoCode, setPromoCode] = useState('')

  // Mock mentor data - in real app this would come from API
  const mentor = {
    id: mentorId || 1,
    name: 'Dr. Anya Sharra',
    title: 'Strategist',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    expertise: ['Stocks', 'ETFs', 'Mutual', 'Funds']
  }

  const timeSlots = [
    '9:00 AM',
    '10:30 AM',
    '1:00 AM',
    '10:30 AM'
  ]

  const calendar = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30]
  ]

  const dayLabels = ['Sun', 'Mo', 'Wo', 'Th', 'Fri', 'Fri', 'Sat']

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleJoinSession = () => {
    console.log('Joining session with:', {
      mentor: mentor.name,
      date: selectedDate,
      time: selectedTime,
      promoCode
    })
  }

  return (
    <div className="booking-page">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <Link to="/" className="logo">
            <div className="logo-icon">🌱</div>
            <span className="logo-text">FinanceFlow</span>
          </Link>
          <nav className="nav-menu">
            <a href="#santors" className="nav-link">Santors</a>
            <a href="#my-sessions" className="nav-link">My Sessions</a>
            <a href="#mentors" className="nav-link nav-mentors">Mentors</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="booking-container">
          <div className="booking-layout">
            {/* Left Side - Booking Form */}
            <div className="booking-form">
              <div className="booking-header">
                <h1>Book a One-to-One Session with Dr. Anya</h1>
                <div className="expertise-tags">
                  {mentor.expertise.map((skill, index) => (
                    <span key={index} className="expertise-tag">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="datetime-section">
                <h3>Select a Date & Time Slot</h3>
                
                {/* Calendar */}
                <div className="calendar-container">
                  <div className="calendar-header">
                    {dayLabels.map((day, index) => (
                      <div key={index} className="day-label">{day}</div>
                    ))}
                  </div>
                  <div className="calendar-grid">
                    {calendar.flat().map((date, index) => (
                      <div
                        key={index}
                        className={`calendar-cell ${date ? 'date-cell' : 'empty-cell'} ${date === selectedDate ? 'selected' : ''}`}
                        onClick={() => handleDateSelect(date)}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="time-slots">
                  {timeSlots.map((time, index) => (
                    <button
                      key={index}
                      className={`time-slot ${time === selectedTime ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Mentor Info & Booking Summary */}
            <div className="booking-sidebar">
              {/* Mentor Card */}
              <div className="mentor-card">
                <div className="mentor-avatar">
                  <img src={mentor.avatar} alt={mentor.name} className="avatar-image" />
                </div>
                <div className="mentor-info">
                  <h3>{mentor.name}</h3>
                  <p>{mentor.title}</p>
                  <div className="mentor-expertise">
                    {mentor.expertise.map((skill, index) => (
                      <span key={index} className="expertise-tag-small">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                
                <div className="summary-item">
                  <span className="label">Date:</span>
                  <span className="value">Tuesday, Nov 13, 2024</span>
                  <button className="join-btn">Join Session</button>
                </div>
                
                <div className="summary-item">
                  <span className="label">Time:</span>
                  <span className="value">10:30 EST</span>
                </div>

                <div className="summary-item">
                  <span className="label">Session Type:</span>
                  <span className="value">One-to-One Mentorship</span>
                  <span className="arrow">›</span>
                </div>

                <div className="summary-item">
                  <span className="label">Dec 150 AM EST</span>
                </div>

                <div className="summary-item price-item">
                  <span className="label">Price:</span>
                  <span className="price">$150.00</span>
                </div>

                <div className="payment-section">
                  <button className="payment-btn">
                    Payment
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        .booking-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 100vh;
          background: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
        }

        .booking-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.85);
          z-index: 1;
        }

        .booking-page > * {
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

        .booking-container {
          background: white;
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .booking-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }

        /* Booking Form */
        .booking-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
          line-height: 1.2;
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

        .datetime-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        /* Calendar */
        .calendar-container {
          margin-bottom: 2rem;
        }

        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .day-label {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
          padding: 0.5rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .calendar-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .empty-cell {
          cursor: default;
        }

        .date-cell {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }

        .date-cell:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .date-cell.selected {
          background: #059669;
          color: white;
          border-color: #059669;
        }

        /* Time Slots */
        .time-slots {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .time-slot {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          text-align: left;
        }

        .time-slot:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .time-slot.selected {
          background: #059669;
          color: white;
          border-color: #059669;
        }

        /* Booking Sidebar */
        .booking-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Mentor Card */
        .mentor-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .mentor-avatar {
          flex-shrink: 0;
        }

        .avatar-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #059669;
        }

        .mentor-info h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .mentor-info p {
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .mentor-expertise {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .expertise-tag-small {
          background: #059669;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        /* Booking Summary */
        .booking-summary {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
        }

        .booking-summary h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .summary-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
          position: relative;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-item .label {
          font-weight: 500;
          color: #374151;
        }

        .summary-item .value {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .join-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          position: absolute;
          right: 0;
        }

        .join-btn:hover {
          background: #047857;
        }

        .arrow {
          color: #9ca3af;
          font-size: 1.2rem;
        }

        .price-item {
          font-weight: 600;
        }

        .price {
          font-size: 1.1rem;
          color: #1f2937;
        }

        /* Payment Section */
        .payment-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .payment-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s ease;
        }

        .payment-btn:hover {
          background: #047857;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .booking-layout {
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

          .booking-header h1 {
            font-size: 1.5rem;
          }

          .mentor-card {
            flex-direction: column;
            text-align: center;
          }

          .calendar-grid {
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  )
}

export default OneToOneBooking
