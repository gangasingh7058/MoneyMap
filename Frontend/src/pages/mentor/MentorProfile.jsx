import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import backgroundImage from '../../assets/image.png'

const MentorProfile = () => {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: '',
    email: '',
    password: '',
    selectedTags: ['Stocks', 'IPOS', 'IPOS', 'ETFs'],
    videoFile: null,
    profilePhoto: null
  })

  const [accountSettings, setAccountSettings] = useState({
    category: 'Cocstur art',
    emailAddress: 'Nniti',
    emailDomain: 'PeaMesters',
    emailField: 'Ceptafturich',
    password: ''
  })

  const availableTags = ['Stocks', 'IPOS', 'ETFs', 'Mutual Funds', 'Crypto', 'Real Estate', 'Options', 'Forex']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAccountSettingsChange = (e) => {
    const { name, value } = e.target
    setAccountSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileData(prev => ({
        ...prev,
        profilePhoto: file
      }))
    }
  }

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileData(prev => ({
        ...prev,
        videoFile: file
      }))
    }
  }

  const toggleTag = (tag) => {
    setProfileData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }))
  }

  const handleSaveChanges = () => {
    console.log('Profile Data:', profileData)
    console.log('Account Settings:', accountSettings)
    // Handle save logic here
    navigate('/mentor/dashboard')
  }

  const handleStripeConnect = () => {
    console.log('Connecting to Stripe...')
    // Handle Stripe connection logic here
  }

  return (
    <div className="mentor-profile-page">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="profile-container">
          {/* Left Section - Profile Setup */}
          <div className="profile-setup-card">
            <h2 className="section-title">Set Up Your Mentor Profile</h2>
            <p className="section-subtitle">Upcher is semboap</p>

            {/* Photo Upload */}
            <div className="photo-upload-section">
              <div className="photo-placeholder">
                <div className="camera-icon">📷</div>
              </div>
              <label className="upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                Upload Photo
              </label>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label className="form-label">Bio <span className="label-hint">(Short introduction)</span></label>
              <textarea
                name="bio"
                placeholder="Eortuindiuation"
                value={profileData.bio}
                onChange={handleInputChange}
                className="form-textarea"
                rows="3"
              />
            </div>

            {/* Expertise Tags */}
            <div className="form-group">
              <label className="form-label">Expertise Tags</label>
              <div className="tags-container">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`tag-btn ${profileData.selectedTags.includes(tag) ? 'tag-selected' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Upload */}
            <div className="form-group">
              <label className="form-label">Upload or Link Intro Video</label>
              <div className="video-upload-section">
                <div className="file-upload-area">
                  <div className="upload-icon">📄</div>
                  <div className="upload-arrow">↗</div>
                  <span className="upload-text">hlee ud drow</span>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="file-input"
                />
                <p className="file-info">Reole vindlarlyes.budp</p>
              </div>
            </div>
          </div>

          {/* Right Section - Account Settings */}
          <div className="account-settings-card">
            <h2 className="section-title">Account Settings</h2>

            {/* Category Dropdown */}
            <div className="form-group">
              <select
                name="category"
                value={accountSettings.category}
                onChange={handleAccountSettingsChange}
                className="form-select"
              >
                <option value="Cocstur art">Cocstur art</option>
                <option value="Investment">Investment</option>
                <option value="Trading">Trading</option>
                <option value="Financial Planning">Financial Planning</option>
              </select>
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <select
                name="emailAddress"
                value={accountSettings.emailAddress}
                onChange={handleAccountSettingsChange}
                className="form-select"
              >
                <option value="Nniti">Nniti</option>
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Email Domain */}
            <div className="form-group">
              <input
                type="text"
                name="emailDomain"
                value={accountSettings.emailDomain}
                onChange={handleAccountSettingsChange}
                className="form-input"
                placeholder="PeaMesters"
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <select
                name="emailField"
                value={accountSettings.emailField}
                onChange={handleAccountSettingsChange}
                className="form-select"
              >
                <option value="Ceptafturich">Ceptafturich</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>

            {/* Password */}
            <div className="form-group">
              <select
                name="password"
                value={accountSettings.password}
                onChange={handleAccountSettingsChange}
                className="form-select"
              >
                <option value="">Password</option>
                <option value="change">Change Password</option>
                <option value="reset">Reset Password</option>
              </select>
            </div>

            {/* Payment Integration */}
            <div className="form-group">
              <label className="form-label">Payment Integration <span className="label-hint">(Stripe Account Link)</span></label>
              <button
                type="button"
                onClick={handleStripeConnect}
                className="stripe-connect-btn"
              >
                Connect with Stripe
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="save-section">
          <button
            type="button"
            onClick={handleSaveChanges}
            className="save-changes-btn"
          >
            Save Changes
          </button>
        </div>
      </main>

      <style jsx>{`
        .mentor-profile-page {
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
          font-size: 1.5rem;
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

        /* Main Content */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .profile-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .profile-setup-card,
        .account-settings-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: #059669;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        /* Photo Upload */
        .photo-upload-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .photo-placeholder {
          width: 80px;
          height: 80px;
          background: #f3f4f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .upload-btn {
          background: #059669;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        .upload-btn:hover {
          background: #047857;
        }

        /* Form Elements */
        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .label-hint {
          font-weight: normal;
          color: #6b7280;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        /* Tags */
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          background: white;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
        }

        .tag-btn:hover {
          border-color: #059669;
          color: #059669;
        }

        .tag-selected {
          background: #059669;
          color: white;
          border-color: #059669;
        }

        /* Video Upload */
        .video-upload-section {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          position: relative;
        }

        .file-upload-area {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .upload-icon {
          font-size: 1.5rem;
        }

        .upload-arrow {
          font-size: 1rem;
        }

        .upload-text {
          color: #6b7280;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .file-info {
          color: #9ca3af;
          font-size: 0.875rem;
          margin: 0;
        }

        /* Stripe Button */
        .stripe-connect-btn {
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

        .stripe-connect-btn:hover {
          background: #047857;
        }

        /* Save Section */
        .save-section {
          display: flex;
          justify-content: center;
        }

        .save-changes-btn {
          padding: 1rem 3rem;
          background: #1e3a8a;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .save-changes-btn:hover {
          background: #1e40af;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-container {
            grid-template-columns: 1fr;
          }
          
          .nav-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-menu {
            gap: 1rem;
          }

          .photo-upload-section {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}

export default MentorProfile
