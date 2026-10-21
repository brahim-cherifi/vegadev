import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/VegaTokenPage.css';
import { FaCopy, FaCheckCircle, FaExternalLinkAlt, FaChartLine, FaShieldAlt, FaRocket, FaCoins } from 'react-icons/fa';
import { BsGraphUpArrow } from 'react-icons/bs';
import { SiBinance, SiEthereum } from 'react-icons/si';

const VegaTokenPage = () => {
  const navigate = useNavigate();
  const [copiedAddress, setCopiedAddress] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tokenAddresses = {
    BSC: '0x5Cca9154B79c09487b50Eb124E4C731CE6DbD8Fd',
    Base: '0x6cde893229A2a43C77515Bc6E2c8194133082a74'
  };

  const copyToClipboard = (address, chain) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(chain);
    toast.success(`${chain} address copied to clipboard!`);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const downloadWhitepaper = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = '/VEGA_Protocol_Token_Whitepaper.pdf';
    link.download = 'VEGA_Protocol_Token_Whitepaper.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Whitepaper download started!');
  };

  const tokenomics = [
    { label: 'Presale', percentage: 30, color: '#4A90E2' },
    { label: 'Liquidity', percentage: 30, color: '#50E3C2' },
    { label: 'Treasury & Operations', percentage: 20, color: '#7B68EE' },
    { label: 'Team (Vested)', percentage: 10, color: '#F5A623' },
    { label: 'Reserve', percentage: 10, color: '#BD10E0' }
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      title: 'Launch',
      timeline: 'Q1 2025',
      items: ['Smart contract deployment', 'Presale & whitelist distribution', 'DODO/Uniswap liquidity', 'Buy-only trading phase'],
      status: 'active'
    },
    {
      phase: 'Phase 2',
      title: 'Expansion',
      timeline: 'Q2 2025',
      items: ['Selling enabled', 'Exchange listings', 'First governance proposals', 'Liquidity mining'],
      status: 'upcoming'
    },
    {
      phase: 'Phase 3',
      title: 'Growth',
      timeline: 'Q3-Q4 2025',
      items: ['Ecosystem partnerships', 'Buyback & burn programs', 'Advanced staking', 'Cross-chain bridges'],
      status: 'upcoming'
    },
    {
      phase: 'Phase 4',
      title: 'Maturity',
      timeline: 'Year 2',
      items: ['Full DAO governance', 'Global adoption', 'Advanced integrations', 'Ecosystem expansion'],
      status: 'upcoming'
    }
  ];

  return (
    <div className="vega-token-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <img src="/vegadevdarklogo.png" alt="VEGA" className="logo-image" />
          </div>
          
          <div className="nav-right">
            <div className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <span className="nav-item" onClick={() => navigate('/')}>Home</span>
              <span className="nav-item active">Token</span>
              <span className="nav-item">Whitepaper</span>
              <span className="nav-item">Community</span>
            </div>
            
            <button className="launch-btn" onClick={() => navigate('/swap')}>
              Launch App
            </button>
            
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="vega-token-hero">
        <motion.div 
          className="vega-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="vega-token-logo-container">
            <img src="/vega-token-logo.png" alt="VEGA Token" className="vega-token-logo" />
          </div>
          
          <h1 className="vega-hero-title">
            VEGA Protocol Token
          </h1>
          
          <p className="vega-hero-subtitle">
            Next-generation DeFi token with advanced on-chain mechanics
            designed for sustainable growth and long-term value creation
          </p>

          <div className="vega-token-stats">
            <div className="vega-stat-card">
              <span className="vega-stat-label">Total Supply</span>
              <span className="vega-stat-value">1,000,000,000</span>
            </div>
            <div className="vega-stat-card">
              <span className="vega-stat-label">Symbol</span>
              <span className="vega-stat-value">VEGA</span>
            </div>
            <div className="vega-stat-card">
              <span className="vega-stat-label">Decimals</span>
              <span className="vega-stat-value">18</span>
            </div>
          </div>

          <div className="vega-contract-addresses">
            <motion.div 
              className="vega-address-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="vega-chain-info">
                <SiBinance className="vega-chain-icon bsc" />
                <span className="vega-chain-name">BSC Network</span>
              </div>
              <div className="vega-address-container">
                <span className="vega-address">{tokenAddresses.BSC.slice(0, 6)}...{tokenAddresses.BSC.slice(-4)}</span>
                <button 
                  className="vega-copy-btn"
                  onClick={() => copyToClipboard(tokenAddresses.BSC, 'BSC')}
                >
                  {copiedAddress === 'BSC' ? <FaCheckCircle /> : <FaCopy />}
                </button>
                <a 
                  href={`https://bscscan.com/token/${tokenAddresses.BSC}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vega-explorer-link"
                >
                  <FaExternalLinkAlt />
                </a>
              </div>
            </motion.div>

            <motion.div 
              className="vega-address-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="vega-chain-info">
                <SiEthereum className="vega-chain-icon base" />
                <span className="vega-chain-name">Base Network</span>
              </div>
              <div className="vega-address-container">
                <span className="vega-address">{tokenAddresses.Base.slice(0, 6)}...{tokenAddresses.Base.slice(-4)}</span>
                <button 
                  className="vega-copy-btn"
                  onClick={() => copyToClipboard(tokenAddresses.Base, 'Base')}
                >
                  {copiedAddress === 'Base' ? <FaCheckCircle /> : <FaCopy />}
                </button>
                <a 
                  href={`https://basescan.org/token/${tokenAddresses.Base}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vega-explorer-link"
                >
                  <FaExternalLinkAlt />
                </a>
              </div>
            </motion.div>
          </div>

          <div className="vega-hero-actions">
            <button className="vega-btn-primary" onClick={() => navigate('/swap')}>
              Buy VEGA
            </button>
            <button className="vega-btn-secondary" onClick={downloadWhitepaper}>
              Download Whitepaper
            </button>
          </div>
        </motion.div>
      </section>

      {/* Navigation Tabs */}
      <div className="vega-content-tabs">
        <button 
          className={`vega-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`vega-tab ${activeTab === 'tokenomics' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokenomics')}
        >
          Tokenomics
        </button>
        <button 
          className={`vega-tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          Features
        </button>
        <button 
          className={`vega-tab ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          Roadmap
        </button>
      </div>

      {/* Content Sections */}
      <div className="vega-content-container">
        {activeTab === 'overview' && (
          <motion.section 
            className="vega-overview-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="vega-section-grid">
              <div className="vega-info-card">
                <h3>What is VEGA?</h3>
                <p>
                  VEGA Protocol Token is a next-generation ERC-20 token built with advanced on-chain mechanics
                  designed to protect early liquidity, stabilize price discovery, and create long-term value for holders.
                </p>
              </div>

              <div className="vega-info-card">
                <h3>Buy-First Model</h3>
                <p>
                  Unlike typical tokens, VEGA introduces a buy-first, sell-later model: users can purchase and hold
                  the token while selling remains disabled until sufficient liquidity is established.
                </p>
              </div>

              <div className="vega-info-card">
                <h3>Problem Solved</h3>
                <p>
                  VEGA addresses common launch issues: low liquidity, early dumping, and unstable price discovery
                  that lead to failed projects and disappointed investors.
                </p>
              </div>

              <div className="vega-info-card">
                <h3>Our Solution</h3>
                <p>
                  Through buy-only phases, liquidity protection, and gradual unlocking, VEGA creates a healthier
                  ecosystem for sustainable growth and fair value discovery.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'tokenomics' && (
          <motion.section 
            className="vega-tokenomics-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="vega-section-title">Token Distribution</h2>
            
            <div className="vega-tokenomics-container">
              <div className="vega-chart-container">
                <svg className="vega-pie-chart" viewBox="0 0 200 200">
                  {(() => {
                    let cumulativePercentage = 0;
                    return tokenomics.map((item, index) => {
                      const startAngle = cumulativePercentage * 3.6;
                      cumulativePercentage += item.percentage;
                      const endAngle = cumulativePercentage * 3.6;
                      
                      const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                      const endAngleRad = (endAngle - 90) * (Math.PI / 180);
                      
                      const x1 = 100 + 80 * Math.cos(startAngleRad);
                      const y1 = 100 + 80 * Math.sin(startAngleRad);
                      const x2 = 100 + 80 * Math.cos(endAngleRad);
                      const y2 = 100 + 80 * Math.sin(endAngleRad);
                      
                      const largeArc = item.percentage > 50 ? 1 : 0;
                      
                      return (
                        <path
                          key={index}
                          d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={item.color}
                          stroke="rgba(0,0,0,0.8)"
                          strokeWidth="2"
                          className="vega-chart-slice"
                        />
                      );
                    });
                  })()}
                </svg>
              </div>
              
              <div className="vega-legend">
                {tokenomics.map((item, index) => (
                  <div key={index} className="vega-legend-item">
                    <span className="vega-legend-color" style={{ backgroundColor: item.color }}></span>
                    <span className="vega-legend-label">{item.label}</span>
                    <span className="vega-legend-value">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="vega-fees-container">
              <h3>Transaction Fees</h3>
              <div className="vega-fee-cards">
                <div className="vega-fee-card">
                  <span className="vega-fee-type">Buy Fee</span>
                  <span className="vega-fee-value">3%</span>
                  <span className="vega-fee-desc">Treasury, Buyback, Burn</span>
                </div>
                <div className="vega-fee-card">
                  <span className="vega-fee-type">Sell Fee</span>
                  <span className="vega-fee-value">5%</span>
                  <span className="vega-fee-desc">When enabled, for liquidity</span>
                </div>
                <div className="vega-fee-card">
                  <span className="vega-fee-type">Transfer Fee</span>
                  <span className="vega-fee-value">15%</span>
                  <span className="vega-fee-desc">Wallet-to-wallet transfers</span>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'features' && (
          <motion.section 
            className="vega-features-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="vega-section-title">Advanced Features</h2>
            
            <div className="vega-features-grid">
              <div className="vega-feature-card">
                <FaShieldAlt className="vega-feature-icon" />
                <h3>Buy-Only Protection</h3>
                <p>Initial phase restricts selling to prevent early dumps and protect liquidity</p>
              </div>
              
              <div className="vega-feature-card">
                <FaChartLine className="vega-feature-icon" />
                <h3>PMM Integration</h3>
                <p>DODO's Proactive Market Maker ensures efficient price discovery with minimal capital</p>
              </div>
              
              <div className="vega-feature-card">
                <BsGraphUpArrow className="vega-feature-icon" />
                <h3>Concentrated Liquidity</h3>
                <p>Uniswap V3 integration for optimized capital efficiency around target prices</p>
              </div>
              
              <div className="vega-feature-card">
                <FaCoins className="vega-feature-icon" />
                <h3>Fee Routing System</h3>
                <p>Automated distribution to Treasury, Buyback, and Burn mechanisms</p>
              </div>
              
              <div className="vega-feature-card">
                <FaRocket className="vega-feature-icon" />
                <h3>Anti-Bot Protection</h3>
                <p>Launch protection mechanisms to ensure fair distribution</p>
              </div>
              
              <div className="vega-feature-card">
                <FaShieldAlt className="vega-feature-icon" />
                <h3>Governance Ready</h3>
                <p>Built-in snapshot and governance hooks for future DAO implementation</p>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'roadmap' && (
          <motion.section 
            className="vega-roadmap-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="vega-section-title">Development Roadmap</h2>
            
            <div className="vega-roadmap-container">
              {roadmapPhases.map((phase, index) => (
                <motion.div 
                  key={index}
                  className={`vega-roadmap-phase ${phase.status}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="vega-phase-header">
                    <span className="vega-phase-number">{phase.phase}</span>
                    <h3>{phase.title}</h3>
                    <span className="vega-phase-timeline">{phase.timeline}</span>
                  </div>
                  <ul className="vega-phase-items">
                    {phase.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* CTA Section */}
      <section className="vega-token-cta">
        <div className="vega-cta-content">
          <h2>Ready to Join the VEGA Ecosystem?</h2>
          <p>Be part of the next generation of DeFi innovation</p>
          <div className="vega-cta-buttons">
            <button className="vega-btn-primary" onClick={() => navigate('/swap')}>
              Get VEGA Token
            </button>
            <button className="vega-btn-secondary">
              Join Community
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VegaTokenPage;
