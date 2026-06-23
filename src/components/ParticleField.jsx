// ── ParticleField ─────────────────────────────────────────────────────────
// High-performance canvas-based floating particles for ambient backgrounds.
import { useRef, useEffect, useCallback } from "react";

export const ParticleField = ({
  count = 60,
  color = "rgba(56, 189, 248, 0.4)",
  speed = 0.3,
  maxSize = 2.5,
  className = "",
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * maxSize + 0.5,
      dx: (Math.random() - 0.5) * speed,
      dy: (Math.random() - 0.5) * speed,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, [count, speed, maxSize]);

  useEffect(() => {
    init();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Extract base RGB components once to avoid regex operations inside the animation frame
    const baseColorMatch = color.match(/rgba?\(([^,]+),\s*([^,]+),\s*([^,)]+)/);
    const baseColor = baseColorMatch 
      ? `rgb(${baseColorMatch[1]}, ${baseColorMatch[2]}, ${baseColorMatch[3]})`
      : color;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      // Draw connection lines between nearby particles using optimized squared distance checks
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = baseColor;
      
      const len = particlesRef.current.length;
      for (let i = 0; i < len; i++) {
        const a = particlesRef.current[i];
        for (let j = i + 1; j < len; j++) {
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < 14400) { // 120 * 120
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.globalAlpha = 0.08 * (1 - dist / 120);
            ctx.stroke();
          }
        }
      }
      
      // Reset globalAlpha to default
      ctx.globalAlpha = 1.0;

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    const handleResize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      init();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [color, init]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};
