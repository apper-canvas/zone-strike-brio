import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

const GameOverScreen = ({ winner, player, gameTime, kills, onPlayAgain, onMainMenu, loading }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isVictory = winner?.isPlayer;
  const placement = isVictory ? 1 : Math.floor(Math.random() * 4) + 2; // Simulate placement

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="h-full flex items-center justify-center bg-gradient-to-br from-background via-hudSurface to-background"
    >
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Victory/Defeat Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <ApperIcon 
              name={isVictory ? "Trophy" : "Skull"} 
              className={`w-16 h-16 mr-4 ${isVictory ? 'text-success' : 'text-error'}`} 
            />
            <h1 className={`text-5xl font-display tracking-wider ${
              isVictory ? 'text-success' : 'text-error'
            }`}>
              {isVictory ? 'VICTORY' : 'DEFEATED'}
            </h1>
          </div>
          <p className="text-lg text-gray-300 font-medium">
            {isVictory ? 'Congratulations! You are the champion!' : 'Better luck next time, soldier.'}
          </p>
        </motion.div>

        {/* Match Statistics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="hud-element rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon name="Medal" className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-3xl font-display text-white mb-1">#{placement}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Placement</div>
          </div>
          
          <div className="hud-element rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon name="Skull" className="w-6 h-6 text-accent" />
            </div>
            <div className="text-3xl font-display text-white mb-1">{kills}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Eliminations</div>
          </div>
          
          <div className="hud-element rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon name="Clock" className="w-6 h-6 text-info" />
            </div>
            <div className="text-3xl font-display text-white mb-1">{formatTime(gameTime)}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">Survival Time</div>
          </div>
          
          <div className="hud-element rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon name="Target" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-display text-white mb-1">
              {Math.floor((kills / gameTime) * 60) || 0}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wide">K/D Per Min</div>
          </div>
        </motion.div>

        {/* Player Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="hud-element rounded-lg p-4 mb-8"
        >
          <h3 className="text-lg font-display text-white mb-4 flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 mr-2" />
            Match Performance
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-white font-medium">Damage Dealt</div>
              <div className="text-gray-400">{kills * (player?.weapon?.damage || 25)}</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">Accuracy</div>
              <div className="text-gray-400">{Math.floor(Math.random() * 30) + 50}%</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">Distance</div>
              <div className="text-gray-400">{Math.floor(gameTime * 2.5)}m</div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-4"
        >
          <Button
            onClick={onPlayAgain}
            disabled={loading}
            size="lg"
            className="w-full bg-primary hover:bg-primary/80 text-white font-display text-lg tracking-wide py-4 rounded-lg border-2 border-primary/50 hover:border-primary transition-all duration-150"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-3" />
                <span>STARTING NEW MATCH...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ApperIcon name="RotateCcw" className="w-5 h-5 mr-3" />
                <span>PLAY AGAIN</span>
              </div>
            )}
          </Button>
          
          <Button
            onClick={onMainMenu}
            disabled={loading}
            size="lg"
            variant="outline"
            className="w-full border-2 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white font-display text-lg tracking-wide py-4 rounded-lg transition-all duration-150"
          >
            <div className="flex items-center justify-center">
              <ApperIcon name="Home" className="w-5 h-5 mr-3" />
              <span>MAIN MENU</span>
            </div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameOverScreen;