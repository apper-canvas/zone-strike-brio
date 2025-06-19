import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const GameCanvas = ({ players, player, match, onPlayerMove, onPlayerShoot }) => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [keys, setKeys] = useState({});
  const [bullets, setBullets] = useState([]);
  const animationFrameRef = useRef();

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PLAYER_SIZE = 12;
  const BULLET_SPEED = 8;
  const PLAYER_SPEED = 3;

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle mouse movement and clicks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const handleMouseClick = (e) => {
      if (!player || !player.isAlive) return;
      
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Create bullet
      const dx = clickX - player.position.x;
      const dy = clickY - player.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const bullet = {
          id: Date.now(),
          x: player.position.x,
          y: player.position.y,
          dx: (dx / distance) * BULLET_SPEED,
          dy: (dy / distance) * BULLET_SPEED,
          playerId: player.Id,
          damage: player.weapon.damage
        };
        
        setBullets(prev => [...prev, bullet]);
        onPlayerShoot({ x: clickX, y: clickY });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [player, onPlayerShoot]);

  // Player movement
  useEffect(() => {
    if (!player || !player.isAlive) return;

    const movePlayer = () => {
      let deltaX = 0;
      let deltaY = 0;

      if (keys['w'] || keys['arrowup']) deltaY -= PLAYER_SPEED;
      if (keys['s'] || keys['arrowdown']) deltaY += PLAYER_SPEED;
      if (keys['a'] || keys['arrowleft']) deltaX -= PLAYER_SPEED;
      if (keys['d'] || keys['arrowright']) deltaX += PLAYER_SPEED;

      if (deltaX !== 0 || deltaY !== 0) {
        const newX = Math.max(PLAYER_SIZE, Math.min(CANVAS_WIDTH - PLAYER_SIZE, player.position.x + deltaX));
        const newY = Math.max(PLAYER_SIZE, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, player.position.y + deltaY));
        
        onPlayerMove({ x: newX, y: newY });
      }
    };

    const moveInterval = setInterval(movePlayer, 16); // ~60 FPS
    return () => clearInterval(moveInterval);
  }, [keys, player, onPlayerMove]);

  // Update bullets
  useEffect(() => {
    const updateBullets = () => {
      setBullets(prev => {
        return prev.map(bullet => ({
          ...bullet,
          x: bullet.x + bullet.dx,
          y: bullet.y + bullet.dy
        })).filter(bullet => 
          bullet.x > 0 && bullet.x < CANVAS_WIDTH && 
          bullet.y > 0 && bullet.y < CANVAS_HEIGHT
        );
      });
    };

    const bulletInterval = setInterval(updateBullets, 16);
    return () => clearInterval(bulletInterval);
  }, []);

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background grid
    ctx.strokeStyle = '#2C5F2D';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < CANVAS_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw zone circle
    if (match?.zone) {
      ctx.strokeStyle = '#FF6B35';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.arc(match.zone.center.x, match.zone.center.y, match.zone.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Zone warning area
      ctx.fillStyle = 'rgba(255, 107, 53, 0.1)';
      ctx.beginPath();
      ctx.arc(match.zone.center.x, match.zone.center.y, match.zone.radius + 20, 0, 2 * Math.PI);
      ctx.arc(match.zone.center.x, match.zone.center.y, match.zone.radius, 0, 2 * Math.PI, true);
      ctx.fill();
    }

    // Draw bullets
    bullets.forEach(bullet => {
      ctx.fillStyle = '#97BC62';
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      // Bullet trail
      ctx.strokeStyle = '#97BC62';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bullet.x - bullet.dx * 3, bullet.y - bullet.dy * 3);
      ctx.lineTo(bullet.x, bullet.y);
      ctx.stroke();
    });

    // Draw players
    players.forEach(p => {
      if (!p.isAlive) return;
      
      // Player shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(p.position.x + 2, p.position.y + 2, PLAYER_SIZE, 0, 2 * Math.PI);
      ctx.fill();
      
      // Player body
      ctx.fillStyle = p.isPlayer ? '#97BC62' : '#FF6B35';
      ctx.beginPath();
      ctx.arc(p.position.x, p.position.y, PLAYER_SIZE, 0, 2 * Math.PI);
      ctx.fill();
      
      // Player border
      ctx.strokeStyle = p.isPlayer ? '#2C5F2D' : '#CC4B1C';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Health bar
      const barWidth = 24;
      const barHeight = 4;
      const healthPercent = p.health / 100;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(p.position.x - barWidth/2, p.position.y - PLAYER_SIZE - 10, barWidth, barHeight);
      
      ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFA726' : '#EF5350';
      ctx.fillRect(p.position.x - barWidth/2, p.position.y - PLAYER_SIZE - 10, barWidth * healthPercent, barHeight);
      
      // Player name
      ctx.fillStyle = 'white';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(p.name, p.position.x, p.position.y - PLAYER_SIZE - 15);
    });

    // Draw crosshair
    if (player && player.isAlive) {
      ctx.strokeStyle = '#97BC62';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mousePosition.x - 10, mousePosition.y);
      ctx.lineTo(mousePosition.x + 10, mousePosition.y);
      ctx.moveTo(mousePosition.x, mousePosition.y - 10);
      ctx.lineTo(mousePosition.x, mousePosition.y + 10);
      ctx.stroke();
      
      // Crosshair circle
      ctx.beginPath();
      ctx.arc(mousePosition.x, mousePosition.y, 15, 0, 2 * Math.PI);
      ctx.stroke();
    }

    animationFrameRef.current = requestAnimationFrame(render);
  }, [players, player, match, bullets, mousePosition]);

  useEffect(() => {
    render();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center h-full bg-gradient-to-br from-background to-hudSurface"
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-primary rounded-lg shadow-2xl cursor-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </motion.div>
  );
};

export default GameCanvas;