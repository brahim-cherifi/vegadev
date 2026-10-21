import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ParticlesSphere from '../components/ParticlesSphere';
import '../styles/VegaHomePage.css';

const VegaHomePage = () => {
  const navigate = useNavigate();
  const [deposits, setDeposits] = useState(0);
  const [loans, setLoans] = useState(0);
  
  useEffect(() => {
    // Animate metrics
    const animateValue = (setter, target, duration) => {
      const steps = 60;
      const stepDuration = duration / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, stepDuration);
    };

    setTimeout(() => {
      animateValue(setDeposits, 5179271585, 2000);
      animateValue(setLoans, 3922894817, 2500);
    }, 500);
  }, []);

  const formatCurrency = (value) => {
    if (value === 0) return '$0';
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="morpho-home">
      {/* Navigation Bar */}
      <nav className="morpho-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>
            </svg>
            <span className="logo-text">VEGA</span>
          </div>
          <div className="nav-links">
            <div className="nav-link dropdown">
              Products
              <svg className="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="nav-link dropdown">
              Solutions
              <svg className="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <a href="#" className="nav-link">Customers</a>
            <a href="#" className="nav-link">Resources</a>
            <a href="#" className="nav-link">Contact</a>
          </div>
          <button 
            className="launch-app-btn"
            onClick={() => navigate('/login')}
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Connect to the universal lending network
          </h1>
          <p className="hero-subtitle">
            Access global liquidity at the best possible terms<br/>
            powered by open infrastructure that serves, not extracts.
          </p>

          {/* 3D Particle Sphere */}
          <ParticlesSphere />

          {/* Metrics */}
          <div className="metrics-container">
            <div className="metric">
              <div className="metric-label">Deposits</div>
              <div className="metric-value">{formatCurrency(deposits)}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Loans</div>
              <div className="metric-value">{formatCurrency(loans)}</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by the World's Leading Innovators
          </motion.h2>
          
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Partner with VEGA DEV to architect next-generation blockchain<br/>
            and DeFi solutions with institutional-grade development standards.
          </motion.p>

          <PartnerLogos />
        </div>
      </motion.section>

      {/* Solutions Section */}
      <motion.section 
        id="solutions"
        className="solutions-section"
        style={{ y: cardsY }}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Core Engineering Capabilities
          </motion.h2>

          <div className="value-cards-grid">
            <ValueCard
              title="Architecting Capital Efficiency"
              subtitle="DEXs, Arbitrage & MEV Systems"
              description="Build custom, low-latency trading infrastructure to secure alpha and maximize returns in onchain markets."
              visualType="dashboard"
              delay={0}
            />
            
            <ValueCard
              title="High-Level Protocol Development"
              subtitle="DeFi Infrastructure & Smart Contracts"
              description="Core blockchain and DeFi protocol design, specializing in novel lending, staking, and asset management systems."
              visualType="code"
              delay={0.2}
            />
            
            <ValueCard
              title="Full-Stack DApp & Web Engineering"
              subtitle="From Protocol to User Interface"
              description="Seamlessly integrate your core DeFi engine with elegant, secure, and user-friendly DApps, web, and desktop applications."
              visualType="interface"
              delay={0.4}
            />
          </div>
        </div>
      </motion.section>

      {/* Technology Section */}
      <section id="technology" className="technology-section">
        <div className="section-container">
          <motion.div 
            className="tech-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              Open by default,<br/>
              <span className="gradient-text">secure by design</span>
            </h2>
            <p className="section-subtitle">
              Top-Tier Engineering. Formally Verified Code. Unquestionable Security.
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
              <div className="feature-icon">🛡️</div>
              <h4>Security Audits</h4>
              <p>Top-Level Developers</p>
            </motion.div>
            
            <motion.div 
              className="tech-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="feature-icon">✓</div>
              <h4>Formal Verification</h4>
              <p>Proprietary Tech & IP</p>
            </motion.div>
            
            <motion.div 
              className="tech-feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="feature-icon">⚡</div>
              <h4>Delivery Excellence</h4>
              <p>100% On-Time Delivery</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Ready to Build the Future?</h2>
            <p className="cta-subtitle">
              Join the elite tier of blockchain innovation with VEGA DEV
            </p>
            <div className="cta-buttons">
              <button 
                className="cta-primary"
                onClick={() => navigate('/login')}
              >
                Access Portal
              </button>
              <button className="cta-secondary">
                Contact Team
              </button>
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
              </div>
              <p>Engineering Excellence in Blockchain</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h5>Solutions</h5>
                <a href="#defi">DeFi Protocols</a>
                <a href="#dex">DEX Development</a>
                <a href="#mev">MEV Systems</a>
              </div>
              <div className="footer-column">
                <h5>Company</h5>
                <a href="#about">About</a>
                <a href="#careers">Careers</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-column">
                <h5>Resources</h5>
                <a href="#docs">Documentation</a>
                <a href="#github">GitHub</a>
                <a href="#blog">Blog</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 VEGA DEV. All rights reserved.</p>
            <div className="footer-socials">
              <a href="#twitter">Twitter</a>
              <a href="#discord">Discord</a>
              <a href="#github">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VegaHomePage;
