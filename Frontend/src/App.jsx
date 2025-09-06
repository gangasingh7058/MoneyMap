import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import InvestorSignIn from './pages/investor/InvestorSignIn'
import InvestorDashboard from './pages/investor/InvestorDashboard'
import ProfileOverview from './pages/investor/ProfileOverview'
import OneToOneBooking from './pages/investor/OneToOneBooking'
import MentorSignIn from './pages/mentor/MentorSignIn'
import MentorProfile from './pages/mentor/MentorProfile'
import MentorDashboard from './pages/mentor/MentorDashboard'

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/investor/signin" element={<InvestorSignIn />} />
          <Route path="/investor/dashboard" element={<InvestorDashboard />} />
          <Route path="/investor/profile-overview/:mentorId" element={<ProfileOverview />} />
          <Route path="/investor/booking/:mentorId" element={<OneToOneBooking />} />
          <Route path="/mentor/signin" element={<MentorSignIn />} />
          <Route path="/mentor/profile" element={<MentorProfile />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
