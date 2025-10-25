import React, { useRef, useEffect, useState } from 'react';
import type { Project } from '../types';
import ZoomControls from './ZoomControls';

interface CanvasProps {
  project: Project;
  onUpdate: (updatedFields: Partial<Project>) => void;
}

const Canvas: React.FC<CanvasProps> = ({ project, onUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingDotIndex, setDraggingDotIndex] = useState<number | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [transform, setTransform] = useState({ zoom: 1, pan: { x: 0, y: 0 } });
  const lastMousePos = useRef({ x: 0, y: 0 });

  const getCanvasPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - transform.pan.x) / transform.zoom;
    const y = (clientY - rect.top - transform.pan.y) / transform.zoom;
    return { x, y };
  };

  // Drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const container = containerRef.current;
    if (!ctx || !canvas || !container) return;

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(transform.pan.x, transform.pan.y);
        ctx.scale(transform.zoom, transform.zoom);

        // Draw lines
        if ((project.showLines ?? true) && project.dots.length > 1) {
            ctx.beginPath();
            ctx.moveTo(project.dots[0].x, project.dots[0].y);
            project.dots.slice(1).forEach(dot => {
                ctx.lineTo(dot.x, dot.y);
            });
            ctx.strokeStyle = project.lineColor || '#000000';
            ctx.lineWidth = (project.lineThickness || 2) / transform.zoom;
            ctx.stroke();
        }

        // Draw dots and numbers
        project.dots.forEach((dot, index) => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, (project.dotSize || 5) / transform.zoom, 0, 2 * Math.PI);
            ctx.fillStyle = project.dotColor || '#000000';
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = `${10 / transform.zoom}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((index + 1).toString(), dot.x, dot.y);
        });

        ctx.restore();
    };

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [project, transform]);

  // Event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getCanvasPoint(e.clientX, e.clientY);
    const dotIndex = project.dots.findIndex(d => Math.hypot(d.x - point.x, d.y - point.y) < 10 / transform.zoom);

    if (e.button === 0) { // Left click
      if (dotIndex !== -1) {
        setDraggingDotIndex(dotIndex);
      } else {
        setIsPanning(true);
      }
    } else if (e.button === 2) { // Right click
      if (dotIndex !== -1) {
        onUpdate({ dots: project.dots.filter((_, i) => i !== dotIndex) });
      }
    }
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingDotIndex !== null) {
      const point = getCanvasPoint(e.clientX, e.clientY);
      const newDots = [...project.dots];
      newDots[draggingDotIndex] = point;
      onUpdate({ dots: newDots });
    } else if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setTransform(t => ({ ...t, pan: { x: t.pan.x + dx, y: t.pan.y + dy }}));
    }
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggingDotIndex === null && !isPanning && e.button === 0) {
        const point = getCanvasPoint(e.clientX, e.clientY);
        onUpdate({ dots: [...project.dots, point] });
    }
    setDraggingDotIndex(null);
    setIsPanning(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(10, transform.zoom * factor));
      setTransform({...transform, zoom: newZoom});
  };

  return (
    <div ref={containerRef} className="w-full h-full relative" onWheel={handleWheel}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setDraggingDotIndex(null); setIsPanning(false); }}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full bg-white"
      />
      <ZoomControls transform={transform} onTransformChange={setTransform} onTransformCommit={() => {}} />
    </div>
  );
};

export default Canvas;