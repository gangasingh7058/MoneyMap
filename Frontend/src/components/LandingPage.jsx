import { Link } from 'react-router-dom'
import backgroundImage from '../assets/image.png'

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">🌱</div>
            <span className="logo-text">FinanceFlow</span>
          </div>
          <nav className="nav-menu">
            <a href="#learn" className="nav-link active">Learn</a>
            <a href="#mentors" className="nav-link">Mentors</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </nav>
          <div className="nav-buttons">
            <Link to="/investor/signin" className="btn btn-secondary">
              Join as Student
            </Link>
            <Link to="/mentor/signin" className="btn btn-primary">
              Become a Mentor
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Learn Smart Investing<br />
              with Experts
            </h1>
            <p className="hero-subtitle">
              Your path to financial growth starts here
            </p>
            <p className="hero-description">
              Join a community of industry-leading mentors and motivated learners, where practical insights, data-driven strategies, and real-world experience come together. Our platform empowers you to make informed investment decisions, develop essential financial skills, and stay ahead in the fast-evolving investment landscape.
            </p>
          </div>
          <div className="hero-image">
            <img src={backgroundImage} alt="Financial experts collaborating" />
            <div className="growth-arrow">📈</div>
          </div>
        </div>
      </section>

      {/* Investment Categories */}
      <section className="categories">
        <div className="categories-container">
          <div className="category-item">
            <div className="category-icon">🏠</div>
            <span>Stocks</span>
          </div>
          <div className="category-item">
            <div className="category-icon">🏛️</div>
            <span>Mutual Funds</span>
          </div>
          <div className="category-item">
            <div className="category-icon">🚀</div>
            <span>IPOS</span>
          </div>
          <div className="category-item">
            <div className="category-icon">🚀</div>
            <span>ETFS</span>
          </div>
          <div className="category-item">
            <div className="category-icon">💼</div>
            <span>ETFs</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Why Choose FinanceFlow?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Expert Learning</h3>
              <p>Learn from experienced financial professionals and industry experts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Smart Strategies</h3>
              <p>Discover proven investment strategies that work in real markets</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Track Progress</h3>
              <p>Monitor your learning journey and investment performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">🌱</div>
              <span className="logo-text">FinanceFlow</span>
            </div>
            <p>Your path to financial growth starts here</p>
          </div>
          
          <div className="footer-columns">
            <div className="footer-column">
              <h4>Learn</h4>
              <ul>
                <li><a href="#stocks">Stocks</a></li>
                <li><a href="#mutual-funds">Mutual Funds</a></li>
                <li><a href="#ipos">IPOs</a></li>
                <li><a href="#etfs">ETFs</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li><a href="#find-mentors">Find Mentors</a></li>
                <li><a href="#live-sessions">Live Sessions</a></li>
                <li><a href="#one-to-one">One-to-One</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 FinanceFlow. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .landing-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.6;
          color: #333;
        }

        /* Header Styles */
        .header {
          background: white;
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
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
          font-size: 1.5rem;
          font-weight: bold;
          color: #2d3748;
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
          color: #4a5568;
          font-weight: 500;
          padding: 0.5rem 0;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .nav-link.active,
        .nav-link:hover {
          color: #48bb78;
          border-bottom-color: #48bb78;
        }

        .nav-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn-secondary {
          background: #4a5568;
          color: white;
        }

        .btn-secondary:hover {
          background: #2d3748;
          transform: translateY(-2px);
        }

        .btn-primary {
          background: #48bb78;
          color: white;
        }

        .btn-primary:hover {
          background: #38a169;
          transform: translateY(-2px);
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, rgba(247, 250, 252, 0.9) 0%, rgba(237, 242, 247, 0.9) 100%), url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          padding: 4rem 0;
          min-height: 70vh;
          display: flex;
          align-items: center;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          color: #2d3748;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #48bb78;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #4a5568;
          line-height: 1.7;
          margin: 0;
          max-width: 600px;
        }

        .hero-image {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .hero-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .growth-arrow {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 3rem;
          opacity: 0.8;
        }

        /* Categories Section */
        .categories {
          padding: 3rem 0;
          background: white;
        }

        .categories-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .category-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          transition: transform 0.3s ease;
        }

        .category-item:hover {
          transform: translateY(-5px);
        }

        .category-icon {
          font-size: 2.5rem;
          color: #48bb78;
        }

        .category-item span {
          font-weight: 600;
          color: #4a5568;
        }

        /* Features Section */
        .features {
          padding: 4rem 0;
          background: #f7fafc;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .features-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: bold;
          color: #2d3748;
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
          text-align: center;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .feature-card p {
          color: #4a5568;
          line-height: 1.6;
          margin: 0;
        }

        /* Footer */
        .footer {
          background: #2d3748;
          color: white;
          padding: 3rem 0 1rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .footer-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .footer-column h4 {
          margin-bottom: 1rem;
          color: white;
        }

        .footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-column li {
          margin-bottom: 0.5rem;
        }

        .footer-column a {
          color: #a0aec0;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-column a:hover {
          color: #48bb78;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 2rem auto 0;
          padding: 1rem 2rem;
          border-top: 1px solid #4a5568;
          text-align: center;
          color: #a0aec0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column;
            gap: 1rem;
          }

          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .footer-container {
            grid-template-columns: 1fr;
          }

          .footer-columns {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
