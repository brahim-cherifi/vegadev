import React from 'react';

const Footer = () => {
  return (
    <footer className="relative z-10 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="glass rounded-xl p-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img 
                src="/vegadevdarklogo.png" 
                alt="VEGA DEV FZCO" 
                className="w-12 h-12 rounded-lg object-contain hover:scale-110 transition-transform duration-300"
              />
              <div>
                <p className="text-white font-bold text-lg">VEGA DEV FZCO</p>
                <p className="text-white/60 text-xs">Virtual Asset Proprietary Trading</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-white/60 text-xs">Licence</p>
                <p className="text-purple-400 text-xs font-mono">DMCC-1007964</p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-xs">Location</p>
                <p className="text-white text-xs font-medium">Dubai, UAE</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-white/40 text-xs">
              &copy; 2026 VEGA DEV FZCO. All rights reserved. | Proprietary trading using company-owned capital.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
