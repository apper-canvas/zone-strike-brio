import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const GameHUD = ({ player, gameTime, zonePhase, kills, playersAlive, onReturnToMenu }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWeaponIcon = (weaponType) => {
    switch (weaponType) {
      case 'pistol': return 'Target';
      case 'rifle': return 'Crosshair';
      case 'sniper': return 'Scope';
      case 'shotgun': return 'Zap';
      default: return 'Target';
    }
  };

  if (!player) return null;

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
        {/* Kill Feed */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hud-element rounded-lg p-3 min-w-[200px]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <ApperIcon name="Skull" className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm font-medium text-white">Eliminations</span>
            </div>
            <span className="text-lg font-display text-secondary">{kills}</span>
          </div>
          <div className="text-xs text-gray-400">
            Players Alive: <span className="text-white font-medium">{playersAlive}</span>
          </div>
        </motion.div>

        {/* Game Timer & Zone */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="hud-element rounded-lg p-3 text-center"
        >
          <div className="text-2xl font-display text-white mb-1">
            {formatTime(gameTime)}
          </div>
          <div className="text-xs text-gray-400 mb-2">Match Time</div>
          <div className="flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="w-4 h-4 text-accent mr-1" />
            <span className="text-sm text-white">Zone {zonePhase}</span>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hud-element rounded-lg p-2"
        >
          <Button
            onClick={onReturnToMenu}
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-30">
        {/* Health & Armor */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hud-element rounded-lg p-4 min-w-[200px]"
        >
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ApperIcon name="Heart" className="w-4 h-4 text-error mr-2" />
                <span className="text-sm font-medium text-white">Health</span>
              </div>
              <span className="text-lg font-display text-white">{player.health}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  player.health > 50 ? 'bg-success' : player.health > 25 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${player.health}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ApperIcon name="Shield" className="w-4 h-4 text-info mr-2" />
                <span className="text-sm font-medium text-white">Armor</span>
              </div>
              <span className="text-lg font-display text-white">{player.armor}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-info h-2 rounded-full transition-all duration-300"
                style={{ width: `${player.armor}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Weapon & Ammo */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hud-element rounded-lg p-4 min-w-[180px]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <ApperIcon 
                name={getWeaponIcon(player.weapon?.type)} 
                className="w-6 h-6 text-secondary mr-3 weapon-icon" 
              />
              <div>
                <div className="text-sm font-medium text-white capitalize">
                  {player.weapon?.type || 'No Weapon'}
                </div>
                <div className="text-xs text-gray-400">
                  {player.weapon?.damage} DMG
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ApperIcon name="Zap" className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm font-medium text-white">Ammo</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-display text-white">{player.ammo}</span>
              <span className="text-sm text-gray-400">/{player.weapon?.ammoCapacity || 0}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                player.ammo > (player.weapon?.ammoCapacity || 1) * 0.5 ? 'bg-success' : 
                player.ammo > (player.weapon?.ammoCapacity || 1) * 0.25 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${(player.ammo / (player.weapon?.ammoCapacity || 1)) * 100}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Zone Warning */}
      {player.health < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none z-20"
        >
          <div className="absolute inset-0 border-4 border-error/30 animate-zone-warning" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="hud-element rounded-lg p-3 text-center">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-sm font-medium text-accent">ZONE DAMAGE</div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default GameHUD;