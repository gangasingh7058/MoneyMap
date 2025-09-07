import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import backgroundImage from '../../assets/image.png'

const InvestorSignIn = () => {
  const navigate = useNavigate()
  
  // Separate states for signin and signup
  const [signinData, setSigninData] = useState({
    email: '',
    password: ''
  })
  
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  
  // Separate loading and error states
  const [signinLoading, setSigninLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)
  const [signinError, setSigninError] = useState('')
  const [signupError, setSignupError] = useState('')

  // Configure axios base URL
  const API_BASE_URL = import.meta.env.VITE_BACKEND_ROUTE

  // Handle signin form input changes
  const handleSigninChange = (e) => {
    const { name, value } = e.target
    setSigninData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (signinError) setSigninError('')
  }

  // Handle signup form input changes
  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (signupError) setSignupError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setSigninLoading(true)
    setSigninError('')

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/student/signin`, {
        email: signinData.email.trim(),
        password: signinData.password.trim()
      })

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('studentToken', data.token)
        localStorage.setItem('userType', 'student')
        
        // Redirect to investor dashboard
        navigate('/investor/dashboard')
      } else {
        setSigninError(data.msg || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.response?.data?.msg) {
        setSigninError(error.response.data.msg)
      } else {
        setSigninError('Network error. Please try again.')
      }
    } finally {
      setSigninLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setSignupLoading(true)
    setSignupError('')

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match')
      setSignupLoading(false)
      return
    }

    if (!signupData.agreeToTerms) {
      setSignupError('Please agree to the Terms & Conditions')
      setSignupLoading(false)
      return
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/student/signup`, {
        name: signupData.fullName.trim(),
        email: signupData.email.trim(),
        password: signupData.password.trim()
      })

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('studentToken', data.token)
        localStorage.setItem('userType', 'student')
        
        // Redirect to investor dashboard
        navigate('/investor/dashboard')
      } else {
        setSignupError(data.msg || 'Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      if (error.response?.data?.msg) {
        setSignupError(error.response.data.msg)
      } else {
        setSignupError('Network error. Please try again.')
      }
    } finally {
      setSignupLoading(false)
    }
  }

  return (
    <div className="signin-page">
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
          <div className="nav-buttons">
            <button className="btn btn-signup">Signup</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="signin-container">
          {/* Login Form */}
          <div className="form-card login-card">
            <h2 className="form-title">Welcome Back</h2>
            {signinError && <div className="error-message">{signinError}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={signinData.email}
                  onChange={handleSigninChange}
                  className="form-input"
                  required
                  disabled={signinLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signinData.password}
                  onChange={handleSigninChange}
                  className="form-input"
                  required
                  disabled={signinLoading}
                />
              </div>
              <div className="form-options">
                <a href="#forgot" className="forgot-link">Forgot Password?</a>
              </div>
              <button type="submit" className="btn btn-login" disabled={signinLoading}>
                {signinLoading ? 'Signing In...' : 'Login'}
              </button>
            </form>
          </div>

          {/* Signup Form */}
          <div className="form-card signup-card">
            <h2 className="form-title">Join the Future of Investing</h2>
            {signupError && <div className="error-message">{signupError}</div>}
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={signupData.fullName}
                  onChange={handleSignupChange}
                  className="form-input"
                  required
                  disabled={signupLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="form-input"
                  required
                  disabled={signupLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="form-input"
                  required
                  disabled={signupLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  className="form-input"
                  required
                  disabled={signupLoading}
                />
              </div>
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={signupData.agreeToTerms}
                    onChange={handleSignupChange}
                    required
                    disabled={signupLoading}
                  />
                  I agree to the Terms & Conditions
                </label>
              </div>
              <button type="submit" className="btn btn-signup-submit" disabled={signupLoading}>
                {signupLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <style jsx>{`
        .signin-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(229, 231, 235, 0.9) 0%, rgba(209, 213, 219, 0.9) 100%), url(${backgroundImage});
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
          color: #1f2937;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .logo:hover {
          color: #059669;
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
          color: #1f2937;
        }

        .nav-buttons .btn {
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-signup {
          background: #059669;
          color: white;
        }

        .btn-signup:hover {
          background: #047857;
        }

        /* Main Content */
        .main-content {
          padding: 4rem 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
        }

        .signin-container {
          display: flex;
          gap: 2rem;
          max-width: 900px;
          width: 100%;
        }

        .form-card {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          flex: 1;
        }

        .login-card {
          border: 3px solid #1e3a8a;
        }

        .signup-card {
          border: 3px solid #059669;
        }

        .form-title {
          font-size: 1.75rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 2rem;
          text-align: left;
        }

        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .forgot-link {
          color: #1f2937;
          text-decoration: underline;
          font-size: 0.875rem;
        }

        .forgot-link:hover {
          color: #059669;
        }

        .btn-login {
          width: 100%;
          padding: 0.875rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-bottom: 1rem;
        }

        .btn-login:hover {
          background: #047857;
        }

        .btn-signup-submit {
          width: 100%;
          padding: 0.875rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn-signup-submit:hover {
          background: #047857;
        }

        .form-footer {
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }

        .signup-link {
          color: #1f2937;
          text-decoration: underline;
        }

        .signup-link:hover {
          color: #059669;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .signin-container {
            flex-direction: column;
            max-width: 400px;
          }
          
          .nav-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-menu {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default InvestorSignIn
