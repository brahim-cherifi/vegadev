import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/MorphoHomePage.css';
import ParticlesSphere from '../components/ParticlesSphere';
import ValueCard from '../components/ValueCard';
import CodeBlock from '../components/CodeBlock';

const MorphoHomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setContactForm({ fullName: '', email: '', company: '', subject: '', message: '' });
  };

  return (
    <div className="morpho-home">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-logo">
            <img 
              src="/vegadevdarklogo.png" 
              alt="VEGA DEV FZCO" 
              className="logo-image"
              onClick={() => scrollToSection('hero')}
            />
          </div>
          
          <div className="nav-right">
            <div className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <span className="nav-item" onClick={() => scrollToSection('hero')}>Home</span>
              <span className="nav-item" onClick={() => scrollToSection('about')}>About Us</span>
              <span className="nav-item" onClick={() => scrollToSection('activities')}>Our Activities</span>
              <span className="nav-item" onClick={() => scrollToSection('technology')}>Trading Technology</span>
              <span className="nav-item" onClick={() => scrollToSection('approach')}>Our Approach</span>
              <span className="nav-item" onClick={() => scrollToSection('contact')}>Contact</span>
            </div>
            
            <button className="launch-btn" onClick={() => scrollToSection('contact')}>
              Get in Touch
            </button>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="hero" className="hero-section">
        <h1 className="hero-title">
          Engineering Intelligence. Trading with Precision.
        </h1>
        
        <p className="hero-subtitle-large">
          Technology-Driven Virtual Asset Proprietary Trading
        </p>

        <p className="hero-description">
          VEGA DEV FZCO is a Dubai-based proprietary trading company combining quantitative research,
          advanced trading infrastructure, and systematic execution technology to participate in global
          virtual asset markets using its own capital. Our approach integrates software engineering,
          market intelligence, and disciplined risk management to support data-driven trading decisions.
        </p>

        <div className="hero-cta-buttons">
          <button className="cta-primary" onClick={() => scrollToSection('approach')}>
            Explore Our Approach
          </button>
          <button className="cta-secondary" onClick={() => scrollToSection('about')}>
            About VEGA DEV
          </button>
        </div>

        {/* Particle Sphere */}
        <div className="sphere-container">
          <ParticlesSphere />
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          Scroll to explore
        </div>
      </main>

      {/* About Us Section */}
      <section id="about" className="partners-section">
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            About VEGA DEV FZCO
          </motion.h2>
          
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            VEGA DEV FZCO is a Dubai-based company specializing in Virtual Asset Proprietary Trading.<br/>
            Our operations combine quantitative research, software engineering, systematic trading strategies,<br/>
            and risk management infrastructure.
          </motion.p>

          <div className="about-details-grid">
            <motion.div 
              className="about-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4>Our Business Model</h4>
              <p>We develop and maintain proprietary technologies to analyze market conditions, evaluate trading opportunities, and execute strategies using company-owned capital. Our business model is centered on independent proprietary trading rather than providing financial services or investment products to external clients.</p>
            </motion.div>

            <motion.div 
              className="about-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4>Our Belief</h4>
              <p>We believe that disciplined research, technological innovation, and responsible risk management are essential foundations for sustainable trading operations.</p>
            </motion.div>

            <motion.div 
              className="about-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4>Mission</h4>
              <p>To develop a technology-driven proprietary trading operation that integrates quantitative research, advanced software engineering, and disciplined risk management.</p>
            </motion.div>

            <motion.div 
              className="about-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4>Vision</h4>
              <p>To establish VEGA DEV FZCO as a recognized proprietary trading technology company, distinguished by research capabilities, operational discipline, and continuous technological innovation.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Core Activities Section */}
      <section id="activities" className="solutions-section">
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Core Activities
          </motion.h2>

          <div className="value-cards-grid">
            <ValueCard
              title="Virtual Asset Proprietary Trading"
              subtitle="Core Business Activity"
              description="We conduct virtual asset trading activities using company-owned capital, supported by internally developed strategies, trading systems, and risk management processes."
              visualType="dashboard"
              delay={0}
            />
            
            <ValueCard
              title="Quantitative Research"
              subtitle="Data-Driven Analysis"
              description="We research and evaluate market behavior through statistical analysis, historical data, quantitative modeling, and systematic strategy development."
              visualType="code"
              delay={0.2}
            />
            
            <ValueCard
              title="Algorithmic Trading"
              subtitle="Systematic Execution"
              description="Our internal trading infrastructure supports systematic market analysis, strategy execution, order management, and automated risk controls."
              visualType="interface"
              delay={0.4}
            />
          </div>

          <div className="value-cards-grid value-cards-grid-second">
            <ValueCard
              title="Market Intelligence"
              subtitle="Research & Insights"
              description="We analyze market structure, liquidity conditions, volatility, and trading activity to support research and proprietary trading decisions."
              visualType="dashboard"
              delay={0.1}
            />
            
            <ValueCard
              title="Risk Management"
              subtitle="Operational Safeguards"
              description="Risk management is integrated into our trading operations through position monitoring, exposure controls, strategy evaluation, and operational safeguards."
              visualType="code"
              delay={0.3}
            />
            
            <ValueCard
              title="Proprietary Technology"
              subtitle="Internal Software Engineering"
              description="We develop internal software systems, analytical tools, and infrastructure to support our proprietary trading operations."
              visualType="interface"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Trading Technology Section */}
      <section id="technology" className="technology-section">
        <div className="section-container">
          <motion.div 
            className="tech-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              Our Trading<br/>
              <span className="gradient-text">Infrastructure</span>
            </h2>
            <p className="section-subtitle">
              Technology is central to VEGA DEV FZCO's proprietary trading operations.<br/>
              Our internal infrastructure combines market data processing, quantitative research,<br/>
              systematic execution, and risk monitoring.
            </p>
          </motion.div>

          <CodeBlock />

          <div className="tech-features">
            <motion.div 
              className="tech-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="feature-icon">📊</div>
              <h4>Market Data Infrastructure</h4>
              <p>Systems to collect, process, validate, and analyze market information</p>
            </motion.div>
            
            <motion.div 
              className="tech-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="feature-icon">🔬</div>
              <h4>Quantitative Research</h4>
              <p>Tools for strategy development, historical testing, and performance evaluation</p>
            </motion.div>
            
            <motion.div 
              className="tech-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="feature-icon">⚡</div>
              <h4>Algorithmic Execution</h4>
              <p>Internally developed systems supporting systematic trade execution</p>
            </motion.div>
          </div>

          <div className="tech-features tech-features-second">
            <motion.div 
              className="tech-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="feature-icon">🛡️</div>
              <h4>Risk Monitoring</h4>
              <p>Tools to monitor market exposure, strategy behavior, and operational risk</p>
            </motion.div>
            
            <motion.div 
              className="tech-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="feature-icon">📈</div>
              <h4>Trading Analytics</h4>
              <p>Analytical infrastructure supporting research and performance monitoring</p>
            </motion.div>
            
            <motion.div 
              className="tech-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="feature-icon">🔧</div>
              <h4>Software Engineering</h4>
              <p>Internal development of software, automation tools, and APIs</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trading Approach Section */}
      <section id="approach" className="approach-section">
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Research-Led. Technology-Driven. Risk-Aware.
          </motion.h2>
          
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our proprietary trading approach is based on systematic research,<br/>
            technological infrastructure, and disciplined execution. We continuously<br/>
            evaluate market conditions and develop internal tools to support trading decisions.
          </motion.p>

          <div className="approach-pillars">
            <motion.div 
              className="pillar-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="pillar-number">01</div>
              <h3>Research</h3>
              <p>Data analysis, market modeling, strategy development, and historical evaluation.</p>
            </motion.div>

            <motion.div 
              className="pillar-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="pillar-number">02</div>
              <h3>Execution</h3>
              <p>Internally developed trading systems designed to support systematic execution and operational efficiency.</p>
            </motion.div>

            <motion.div 
              className="pillar-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="pillar-number">03</div>
              <h3>Risk Management</h3>
              <p>Exposure monitoring, risk limits, strategy evaluation, and continuous operational oversight.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="cta-section">
        <div className="section-container">
          <motion.div 
            className="contact-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Get in Touch</h2>
            <p className="cta-subtitle">
              For corporate inquiries, professional correspondence, and general information<br/>
              about VEGA DEV FZCO, please contact our team.
            </p>

            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-info-card">
                  <h4>Company</h4>
                  <p>VEGA DEV FZCO</p>
                </div>
                <div className="contact-info-card">
                  <h4>Licence</h4>
                  <p>DMCC-1007964</p>
                </div>
                <div className="contact-info-card">
                  <h4>Office</h4>
                  <p>Unit No: UT-12-CO-319<br/>
                  DMCC Business Centre<br/>
                  Level 12, Uptown Tower<br/>
                  Dubai, United Arab Emirates</p>
                </div>
                <div className="contact-info-card">
                  <h4>Email</h4>
                  <p>
                    <a href="mailto:brahim@vega-dev.com">brahim@vega-dev.com</a><br/>
                    <a href="mailto:mustafa@vega-dev.com">mustafa@vega-dev.com</a>
                  </p>
                </div>
                <div className="contact-info-card">
                  <h4>Telephone</h4>
                  <p><a href="tel:+971585224550">+971 58 522 4550</a></p>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleContactSubmit}>
                {formSubmitted ? (
                  <div className="form-success">
                    <p>Thank you for your inquiry. We will respond shortly.</p>
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={contactForm.fullName}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="company">Company / Organization</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={contactForm.company}
                        onChange={handleContactChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject *</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="cta-primary form-submit-btn">
                      Send Message
                    </button>
                  </>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="vega-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-text">VEGA</span>
                <span className="logo-accent">DEV</span>
                <span className="logo-fzco"> FZCO</span>
              </div>
              <p>Dubai-based proprietary trading company focused on virtual asset markets, quantitative research, and internally developed trading technology.</p>
              <p className="footer-licence">DMCC Commercial Licence No. DMCC-1007964</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h5>Activities</h5>
                <a href="#activities" onClick={(e) => { e.preventDefault(); scrollToSection('activities'); }}>Proprietary Trading</a>
                <a href="#activities" onClick={(e) => { e.preventDefault(); scrollToSection('activities'); }}>Quantitative Research</a>
                <a href="#activities" onClick={(e) => { e.preventDefault(); scrollToSection('activities'); }}>Algorithmic Trading</a>
              </div>
              <div className="footer-column">
                <h5>Company</h5>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
                <a href="#approach" onClick={(e) => { e.preventDefault(); scrollToSection('approach'); }}>Our Approach</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
              </div>
              <div className="footer-column">
                <h5>Contact</h5>
                <a href="mailto:brahim@vega-dev.com">brahim@vega-dev.com</a>
                <a href="mailto:mustafa@vega-dev.com">mustafa@vega-dev.com</a>
                <a href="tel:+971585224550">+971 58 522 4550</a>
              </div>
            </div>
          </div>
          <div className="footer-address">
            <p>Uptown Tower, Level 12 | DMCC Business Centre | Dubai, United Arab Emirates</p>
          </div>
          <div className="footer-disclaimer">
            <p>VEGA DEV FZCO conducts proprietary trading activities using its own capital. The information provided on this website is for general corporate information only and does not constitute an offer to sell, solicitation to purchase, investment recommendation, or invitation to participate in any virtual asset investment product.</p>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 VEGA DEV FZCO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MorphoHomePage;
