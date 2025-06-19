import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

const MainMenu = ({ onStartGame, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="h-full flex items-center justify-center bg-gradient-to-br from-background via-hudSurface to-background"
    >
      <div className="text-center max-w-md mx-auto px-6">
        {/* Game Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <ApperIcon 
              name="Target" 
              className="w-16 h-16 text-primary mr-4" 
            />
            <h1 className="text-6xl font-display text-white tracking-wider">
              ZONE
            </h1>
          </div>
          <div className="flex items-center justify-center">
            <h2 className="text-4xl font-display text-secondary tracking-widest">
              STRIKE
            </h2>
            <ApperIcon 
              name="Crosshair" 
              className="w-12 h-12 text-accent ml-4" 
            />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-gray-300 mb-12 font-medium"
        >
          Survive the shrinking zone. Eliminate all opponents.
        </motion.p>

        {/* Game Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          <div className="hud-element rounded-lg p-3">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon name="Users" className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-2xl font-display text-white">5</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Players</div>
          </div>
          <div className="hud-element rounded-lg p-3">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon name="Zap" className="w-6 h-6 text-accent" />
            </div>
            <div className="text-2xl font-display text-white">3</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Weapons</div>
          </div>
          <div className="hud-element rounded-lg p-3">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon name="Shield" className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-display text-white">1</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Winner</div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            onClick={onStartGame}
            disabled={loading}
            size="lg"
            className="w-full mb-4 bg-primary hover:bg-primary/80 text-white font-display text-xl tracking-wide py-4 rounded-lg border-2 border-primary/50 hover:border-primary transition-all duration-150"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-3" />
                <span>STARTING MATCH...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ApperIcon name="Play" className="w-6 h-6 mr-3" />
                <span>START MATCH</span>
              </div>
            )}
          </Button>
        </motion.div>

        {/* Controls Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-center"
        >
          <div className="text-sm text-gray-400 mb-2">Controls:</div>
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <span className="bg-hudSurface px-2 py-1 rounded mr-2 font-mono">WASD</span>
              Move
            </div>
            <div className="flex items-center">
              <span className="bg-hudSurface px-2 py-1 rounded mr-2 font-mono">MOUSE</span>
              Aim & Shoot
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainMenu;