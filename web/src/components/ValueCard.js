import React from 'react';
import { motion } from 'framer-motion';

const ValueCard = ({ title, subtitle, description, visualType, delay }) => {
  const renderVisual = () => {
    switch(visualType) {
      case 'dashboard':
        return (
          <div className="visual-dashboard">
            <div className="dashboard-header">
              <div className="dashboard-tab active">Market Monitor</div>
              <div className="dashboard-tab">Analytics</div>
            </div>
            <div className="dashboard-content">
              <div className="metric-row">
                <span className="metric-label">Active Strategies</span>
                <span className="metric-value positive">12</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Risk Utilization</span>
                <span className="metric-value">67.3%</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">System Uptime</span>
                <span className="metric-value">99.9%</span>
              </div>
              <div className="chart-placeholder">
                <svg viewBox="0 0 200 80" className="mini-chart">
                  <path 
                    d="M 0,60 L 30,50 L 60,30 L 90,40 L 120,20 L 150,25 L 180,10 L 200,15" 
                    stroke="#8B5CF6" 
                    strokeWidth="2" 
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      
      case 'code':
        return (
          <div className="visual-code">
            <div className="code-header">
              <span className="code-file">QuantEngine.py</span>
              <div className="code-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <pre className="code-content">
              <code>
{`class QuantEngine:
    def __init__(self, config):
        self.risk_limits = config.limits
        self.models = []
    
    def evaluate_signal(
        self, market_data, model
    ):
        signal = model.predict(
            market_data
        )
        
        if self.validate_risk(signal):
            return signal
        return None`}
              </code>
            </pre>
          </div>
        );
      
      case 'interface':
        return (
          <div className="visual-interface">
            <div className="interface-header">
              <div className="interface-nav">
                <span className="nav-item active">Overview</span>
                <span className="nav-item">Positions</span>
                <span className="nav-item">Risk</span>
              </div>
            </div>
            <div className="interface-content">
              <div className="balance-card">
                <span className="balance-label">System Status</span>
                <span className="balance-amount">Operational</span>
              </div>
              <div className="position-list">
                <div className="position-item">
                  <span className="position-token">Data Pipeline</span>
                  <span className="position-apy">Active</span>
                </div>
                <div className="position-item">
                  <span className="position-token">Risk Monitor</span>
                  <span className="position-apy">Active</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="value-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <h4 className="card-subtitle">{subtitle}</h4>
        <p className="card-description">{description}</p>
      </div>
      <div className="card-visual">
        {renderVisual()}
      </div>
    </motion.div>
  );
};

export default ValueCard;
