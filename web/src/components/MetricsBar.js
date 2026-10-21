import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MetricsBar = () => {
  const [protocolsDeployed, setProtocolsDeployed] = useState(0);
  const [valueSecured, setValueSecured] = useState(0);

  useEffect(() => {
    // Animate numbers on mount
    const protocolTarget = 51;
    const valueTarget = 15821990123;

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
      animateValue(setProtocolsDeployed, protocolTarget, 2000);
      animateValue(setValueSecured, valueTarget, 2500);
    }, 500);
  }, []);

  const formatValue = (value) => {
    if (value === 0) return '$0';
    return `$${value.toLocaleString()}`;
  };

  return (
    <motion.div 
      className="metrics-bar"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <div className="metric-item">
        <span className="metric-label">Protocols Deployed</span>
        <motion.span 
          className="metric-value"
          key={protocolsDeployed}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {protocolsDeployed}
        </motion.span>
      </div>
      
      <div className="metric-divider" />
      
      <div className="metric-item">
        <span className="metric-label">Total Value Secured</span>
        <motion.span 
          className="metric-value"
          key={valueSecured}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {formatValue(valueSecured)}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default MetricsBar;
