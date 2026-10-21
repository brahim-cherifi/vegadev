import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CodeBlock = () => {
  const [activeTab, setActiveTab] = useState('engine');

  const codeExamples = {
    engine: {
      title: 'TradingEngine.py',
      code: `# VEGA DEV FZCO — Internal Trading Infrastructure
# Proprietary System — Confidential

import numpy as np
from typing import Optional, Dict, List
from dataclasses import dataclass

@dataclass
class MarketSignal:
    """Represents a processed market signal."""
    timestamp: float
    instrument: str
    direction: str
    confidence: float
    risk_score: float

class TradingEngine:
    """Core engine for systematic trading execution."""
    
    def __init__(self, config: Dict):
        self.risk_limits = config['risk_limits']
        self.position_manager = PositionManager(config)
        self.execution_handler = ExecutionHandler(config)
        self.active_strategies: List = []
    
    def process_signal(
        self,
        signal: MarketSignal
    ) -> Optional[Dict]:
        """Process incoming signal with risk validation."""
        
        # Validate signal against risk parameters
        if not self._validate_risk(signal):
            return None
        
        # Check position limits
        current_exposure = self.position_manager.get_exposure()
        if current_exposure >= self.risk_limits['max_exposure']:
            return None
        
        # Generate execution parameters
        execution_params = self._calculate_execution(signal)
        
        return execution_params
    
    def _validate_risk(self, signal: MarketSignal) -> bool:
        """Internal risk validation logic."""
        return (
            signal.confidence >= self.risk_limits['min_confidence']
            and signal.risk_score <= self.risk_limits['max_risk']
        )`
    },
    analytics: {
      title: 'MarketAnalytics.py',
      code: `# VEGA DEV FZCO — Market Analytics Module
# Internal Research Infrastructure

import numpy as np
from scipy import stats
from typing import Dict, Tuple

class MarketAnalytics:
    """Analytical tools for market research."""
    
    def __init__(self, lookback_window: int = 252):
        self.lookback = lookback_window
        self.data_cache: Dict = {}
    
    def calculate_volatility(
        self,
        returns: np.ndarray,
        method: str = 'ewma'
    ) -> float:
        """Calculate volatility using specified method."""
        
        if method == 'ewma':
            weights = np.exp(
                np.linspace(-1.0, 0.0, len(returns))
            )
            weights /= weights.sum()
            variance = np.average(
                (returns - returns.mean()) ** 2,
                weights=weights
            )
            return np.sqrt(variance * 252)
        
        return np.std(returns) * np.sqrt(252)
    
    def analyze_market_structure(
        self,
        order_book: Dict,
        trade_data: np.ndarray
    ) -> Dict:
        """Analyze market microstructure."""
        
        bid_depth = sum(order_book['bids'].values())
        ask_depth = sum(order_book['asks'].values())
        
        imbalance = (bid_depth - ask_depth) / (bid_depth + ask_depth)
        
        spread = self._calculate_spread(order_book)
        
        return {
            'imbalance': imbalance,
            'spread': spread,
            'depth_ratio': bid_depth / ask_depth,
            'volume_profile': self._volume_analysis(trade_data)
        }`
    },
    risk: {
      title: 'RiskManager.py',
      code: `# VEGA DEV FZCO — Risk Management Framework
# Internal Operations Module

import numpy as np
from typing import Dict, List, Optional
from dataclasses import dataclass, field

@dataclass
class RiskMetrics:
    """Portfolio risk metrics container."""
    total_exposure: float
    net_exposure: float
    var_95: float
    max_drawdown: float
    sharpe_ratio: float

class RiskManager:
    """Integrated risk monitoring and control system."""
    
    def __init__(self, config: Dict):
        self.limits = config['limits']
        self.alert_thresholds = config['alerts']
        self.positions: Dict = {}
        self.risk_history: List = []
    
    def evaluate_portfolio_risk(self) -> RiskMetrics:
        """Calculate current portfolio risk metrics."""
        
        exposures = np.array([
            pos['notional'] for pos in self.positions.values()
        ])
        
        total_exposure = np.abs(exposures).sum()
        net_exposure = exposures.sum()
        
        # Value at Risk calculation
        var_95 = self._calculate_var(
            confidence=0.95,
            horizon_days=1
        )
        
        # Maximum drawdown
        max_dd = self._calculate_max_drawdown()
        
        metrics = RiskMetrics(
            total_exposure=total_exposure,
            net_exposure=net_exposure,
            var_95=var_95,
            max_drawdown=max_dd,
            sharpe_ratio=self._calculate_sharpe()
        )
        
        # Check against limits
        self._check_limits(metrics)
        
        return metrics
    
    def _check_limits(self, metrics: RiskMetrics) -> None:
        """Validate metrics against configured limits."""
        if metrics.total_exposure > self.limits['max_total_exposure']:
            self._trigger_alert('EXPOSURE_BREACH', metrics)
        if metrics.var_95 > self.limits['max_var']:
            self._trigger_alert('VAR_BREACH', metrics)`
    }
  };

  return (
    <motion.div 
      className="code-block-container"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="code-tabs">
        {Object.keys(codeExamples).map((key) => (
          <button
            key={key}
            className={`code-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {key === 'engine' ? 'Trading Engine' : 
             key === 'analytics' ? 'Market Analytics' : 
             'Risk Management'}
          </button>
        ))}
      </div>
      
      <div className="code-window">
        <div className="code-header">
          <span className="code-filename">{codeExamples[activeTab].title}</span>
          <div className="code-actions">
            <span className="code-action">Internal</span>
          </div>
        </div>
        <div className="code-content-wrapper">
          <pre className="code-content">
            <code className="language-python">
              {codeExamples[activeTab].code}
            </code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeBlock;
