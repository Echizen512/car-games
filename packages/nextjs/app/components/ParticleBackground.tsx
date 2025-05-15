import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
}

interface ParticleBackgroundProps {
  rarity: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ rarity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getParticleColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'común':
      case 'common':
        return '#3B82F6'; // blue
      case 'poco común':
      case 'uncommon':
        return '#22C55E'; // green
      case 'raro':
      case 'rare':
        return '#A855F7'; // purple
      case 'épico':
      case 'epic':
        return '#F97316'; // orange
      case 'legendario':
      case 'legendary':
        return '#EAB308'; // yellow
      default:
        return '#6B7280'; // gray
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = 50;
    const color = getParticleColor(rarity);

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap particles around screen
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [rarity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30"
    />
  );
};

export default ParticleBackground;