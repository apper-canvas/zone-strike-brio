import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Minimap = ({ players, player, zone, className = '' }) => {
  const MINIMAP_SIZE = 120;
  const WORLD_SIZE = 800; // Assuming canvas is 800x800
  const scale = MINIMAP_SIZE / WORLD_SIZE;

  const getPlayerPosition = (worldPos) => ({
    x: worldPos.x * scale,
    y: worldPos.y * scale
  });

  const getZoneRadius = (worldRadius) => worldRadius * scale;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${className}`}
    >
      <div className="minimap rounded-lg p-2 shadow-lg">
        {/* Minimap Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <ApperIcon name="Radar" className="w-4 h-4 text-primary mr-1" />
            <span className="text-xs font-medium text-white">MINIMAP</span>
          </div>
          <div className="text-xs text-gray-400">
            {players?.filter(p => p.isAlive).length || 0} ALIVE
          </div>
        </div>

        {/* Minimap Display */}
        <div className="relative">
          <svg 
            width={MINIMAP_SIZE} 
            height={MINIMAP_SIZE}
            className="bg-gray-900 rounded border border-primary/30"
          >
            {/* Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2C5F2D" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Zone Circle */}
            {zone && (
              <g>
                <circle
                  cx={zone.center.x * scale}
                  cy={zone.center.y * scale}
                  r={getZoneRadius(zone.radius)}
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="2"
                  strokeDasharray="3,2"
                  className="zone-circle"
                />
                <circle
                  cx={zone.center.x * scale}
                  cy={zone.center.y * scale}
                  r={getZoneRadius(zone.radius)}
                  fill="rgba(255, 107, 53, 0.1)"
                />
              </g>
            )}
            
            {/* Players */}
            {players?.map(p => {
              if (!p.isAlive) return null;
              
              const pos = getPlayerPosition(p.position);
              const isCurrentPlayer = p.isPlayer;
              
              return (
                <g key={p.Id}>
                  {/* Player dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isCurrentPlayer ? 4 : 3}
                    fill={isCurrentPlayer ? '#97BC62' : '#FF6B35'}
                    stroke={isCurrentPlayer ? '#2C5F2D' : '#CC4B1C'}
                    strokeWidth="1"
                    className={isCurrentPlayer ? 'player-dot' : ''}
                  />
                  
                  {/* Player direction indicator for current player */}
                  {isCurrentPlayer && (
                    <line
                      x1={pos.x}
                      y1={pos.y}
                      x2={pos.x}
                      y2={pos.y - 8}
                      stroke="#97BC62"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}
          </svg>
          
          {/* Minimap Overlay Info */}
          <div className="absolute top-1 right-1 text-xs text-gray-400">
            N
          </div>
        </div>
        
        {/* Zone Info */}
        {zone && (
          <div className="mt-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
                <span className="text-gray-300">Zone</span>
              </div>
              <span className="text-white font-medium">
                {Math.floor(zone.radius)}m
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-400">Damage</span>
              <span className="text-accent font-medium">
                {zone.damagePerSecond}/s
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Minimap;