import { useEffect, useRef } from 'react';

export function AnimatedNeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame = 0;
    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0007,
      vy: (Math.random() - 0.5) * 0.0007,
      r: 1 + Math.random() * 2,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x <= 0 || particle.x >= 1) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= 1) particle.vy *= -1;

        const px = particle.x * canvas.width;
        const py = particle.y * canvas.height;

        for (let i = index + 1; i < particles.length; i += 1) {
          const other = particles[i];
          const ox = other.x * canvas.width;
          const oy = other.y * canvas.height;
          const distance = Math.hypot(px - ox, py - oy);
          if (distance < 170) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.11 - distance / 1900})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(ox, oy);
            ctx.stroke();
          }
        }

        const gradient = ctx.createRadialGradient(px, py, 0, px, py, 20);
        gradient.addColorStop(0, 'rgba(96, 165, 250, 0.75)');
        gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, particle.r * 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(191, 219, 254, 0.9)';
        ctx.beginPath();
        ctx.arc(px, py, particle.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-20 opacity-70" />;
}
