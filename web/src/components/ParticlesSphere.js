import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ParticlesSphere = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 20000; // Even more particles for smoother appearance
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        // Create particles uniformly distributed on sphere surface
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 220; // Bigger radius for larger sphere
        
        this.x = radius * Math.sin(phi) * Math.cos(theta);
        this.y = radius * Math.sin(phi) * Math.sin(theta);
        this.z = radius * Math.cos(phi);
        
        this.baseX = this.x;
        this.baseY = this.y;
        this.baseZ = this.z;
        
        this.size = 0.6; // Bigger for brighter appearance
        this.opacity = 1.0; // Full opacity for brightness
        this.pulseSpeed = 0;
        this.pulseOffset = 0;
      }

      update(time) {
        // Slow rotation for majestic effect
        const rotationSpeed = 0.001;
        const cosRotation = Math.cos(rotationSpeed);
        const sinRotation = Math.sin(rotationSpeed);
        
        const x = this.baseX;
        const z = this.baseZ;
        
        this.baseX = x * cosRotation - z * sinRotation;
        this.baseZ = x * sinRotation + z * cosRotation;
        
        // Simple position update
        this.x = this.baseX;
        this.y = this.baseY;
        this.z = this.baseZ;
      }

      draw(ctx, centerX, centerY) {
        // 3D to 2D projection
        const perspective = 500;
        const scale = perspective / (perspective + this.z);
        const x2d = this.x * scale + centerX;
        const y2d = this.y * scale + centerY;
        const size2d = this.size * scale;
        
        // Morpho-style gradient: lighter/whiter at edges, blue in center
        const normalizedZ = (this.z + 220) / 440; // Normalize z from 0 to 1
        
        // MUCH brighter gradient - exactly like Morpho
        let r, g, b, opacity;
        const edgeFactor = Math.abs(normalizedZ - 0.5) * 2; // 0 at center, 1 at edges
        
        if (normalizedZ < 0.2) { // Front edge - almost white
          r = 255;
          g = 255;
          b = 255;
          opacity = 1.0;
        } else if (normalizedZ < 0.4) { // Front mid - light blue
          r = 200;
          g = 220;
          b = 255;
          opacity = 1.0;
        } else if (normalizedZ > 0.8) { // Back edge - bright blue
          r = 255;
          g = 255;
          b = 255;
          opacity = 0.8;
        } else if (normalizedZ > 0.6) { // Back mid - medium blue
          r = 120;
          g = 180;
          b = 255;
          opacity = 1.0;
        } else { // Center - vibrant blue
          r = 100;
          g = 160;
          b = 255;
          opacity = 1.0;
        }
        
        // Draw particle
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fillRect(x2d - size2d/2, y2d - size2d/2, size2d, size2d);
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop with optimizations
    let time = 0;
    let frameCount = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle glow background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 / window.devicePixelRatio,
        canvas.height / 2 / window.devicePixelRatio,
        0,
        canvas.width / 2 / window.devicePixelRatio,
        canvas.height / 2 / window.devicePixelRatio,
        250
      );
      gradient.addColorStop(0, 'rgba(100, 150, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Use lighter blend mode for maximum brightness
      ctx.globalCompositeOperation = 'lighter';
      
      const centerX = canvas.width / 2 / window.devicePixelRatio;
      const centerY = canvas.height / 2 / window.devicePixelRatio;
      
      // Sort particles every 3 frames for better performance
      if (frameCount % 3 === 0) {
        particles.sort((a, b) => b.z - a.z);
      }
      frameCount++;
      
      // Batch draw operations for better performance
      ctx.save();
      particles.forEach(particle => {
        particle.update(time);
        particle.draw(ctx, centerX, centerY);
      });
      ctx.restore();
      
      time += 0.016; // ~60fps
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse tracking
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // No dependencies

  return (
    <motion.div 
      className="particles-sphere-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <canvas 
        ref={canvasRef}
        className="particles-canvas"
        style={{ width: '700px', height: '700px' }}
      />
    </motion.div>
  );
};

export default ParticlesSphere;
