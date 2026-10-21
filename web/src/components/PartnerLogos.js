import React from 'react';
import { motion } from 'framer-motion';

const PartnerLogos = () => {
  // Technology focus areas for scrolling display
  const techAreas = [
    { id: 1, name: 'Quantitative Research', color: '#4A90E2', symbol: '�' },
    { id: 2, name: 'Risk Management', color: '#50E3C2', symbol: '�️' },
    { id: 3, name: 'Market Analysis', color: '#7B68EE', symbol: '�' },
    { id: 4, name: 'Algorithmic Trading', color: '#4169E1', symbol: '⚡' },
    { id: 5, name: 'Data Engineering', color: '#1AAB9B', symbol: '🔬' },
    { id: 6, name: 'Execution Systems', color: '#00D1FF', symbol: '🎯' },
    { id: 7, name: 'Strategy Research', color: '#0250C5', symbol: '🧠' },
    { id: 8, name: 'Infrastructure', color: '#4A90E2', symbol: '🔧' },
    { id: 9, name: 'Analytics', color: '#7B68EE', symbol: '📉' },
    { id: 10, name: 'Automation', color: '#50E3C2', symbol: '⚙️' },
    { id: 11, name: 'Monitoring', color: '#006AE3', symbol: '�️' },
    { id: 12, name: 'Software Dev', color: '#4169E1', symbol: '�' },
  ];

  return (
    <div className="partners-container">
      <motion.div 
        className="partners-orbit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* First row - scrolling left */}
        <motion.div 
          className="partners-row"
          animate={{ x: [0, -1920] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...techAreas, ...techAreas].map((item, index) => (
            <div key={`${item.id}-${index}`} className="partner-logo">
              <div 
                className="logo-box"
                style={{ backgroundColor: item.color + '20', borderColor: item.color }}
              >
                <span className="logo-symbol">{item.symbol}</span>
                <span className="logo-name">{item.name}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Second row - scrolling right */}
        <motion.div 
          className="partners-row"
          animate={{ x: [-1920, 0] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
        >
          {[...techAreas.slice(6), ...techAreas.slice(0, 6), ...techAreas.slice(6), ...techAreas.slice(0, 6)].map((item, index) => (
            <div key={`${item.id}-b-${index}`} className="partner-logo">
              <div 
                className="logo-box"
                style={{ backgroundColor: item.color + '20', borderColor: item.color }}
              >
                <span className="logo-symbol">{item.symbol}</span>
                <span className="logo-name">{item.name}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PartnerLogos;
