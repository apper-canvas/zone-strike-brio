import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import GameCanvas from "@/components/organisms/GameCanvas";
import GameHUD from "@/components/organisms/GameHUD";
import MainMenu from "@/components/organisms/MainMenu";
import GameOverScreen from "@/components/organisms/GameOverScreen";
import Minimap from "@/components/organisms/Minimap";
import { matchService, playerService } from "@/services";

const Game = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
  const [currentMatch, setCurrentMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  const [zonePhase, setZonePhase] = useState(1);
  const [kills, setKills] = useState(0);
  const [winner, setWinner] = useState(null);
  
  const gameLoopRef = useRef(null);
  const zoneTimerRef = useRef(null);
  const gameTimeRef = useRef(null);

  // Initialize game data
// Initialize game data
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const playersData = await playerService.getAll();
        setPlayers(playersData);
        setPlayer(playersData.find(p => p.is_player) || playersData[0]);
      } catch (err) {
        console.error('Failed to initialize game:', err);
        setError(err.message || 'Failed to load game data');
      }
    };
    
    initializeGame();

  const startGame = async () => {
    setLoading(true);
    setError(null);
    
    try {
const matchData = {
        Name: `Match ${Date.now()}`,
        state: 'active',
        max_players: 5,
        game_mode: 'Battle Royale',
        zone: JSON.stringify({
          center: { x: 400, y: 300 },
          radius: 350,
          shrinkTime: 60,
          damagePerSecond: 5
        }),
        map_size: JSON.stringify({ width: 800, height: 600 }),
        time_elapsed: 0
      };
      const match = await matchService.create(matchData);
      const playersData = await playerService.getAll();
      
      // Reset player states
      const resetPlayers = playersData.map(p => ({
        ...p,
        health: 100,
        armor: 0,
        kills: 0,
        isAlive: true,
        position: {
          x: Math.random() * 600 + 100,
          y: Math.random() * 400 + 100
        }
      }));
      
      setCurrentMatch(match);
      setPlayers(resetPlayers);
setPlayer(resetPlayers.find(p => p.is_player) || resetPlayers[0]);
      setGameState('playing');
      setGameTime(0);
      setZonePhase(1);
      setKills(0);
      setWinner(null);
      
      // Start game timers
      startGameLoop();
      startZoneTimer();
      startGameTimer();
      
      toast.success('Match started! Good luck!');
    } catch (err) {
      setError(err.message || 'Failed to start match');
      toast.error('Failed to start match');
    } finally {
      setLoading(false);
    }
  };

  const startGameLoop = () => {
    gameLoopRef.current = setInterval(() => {
      updateAI();
      checkGameEnd();
    }, 100); // 10 FPS for AI updates
  };

  const startZoneTimer = () => {
    zoneTimerRef.current = setInterval(() => {
      setCurrentMatch(prev => {
        if (!prev) return prev;
        
        const newRadius = Math.max(50, prev.zone.radius - 2);
        const newDamage = prev.zone.damagePerSecond + (prev.zone.radius <= 100 ? 2 : 0);
        
        if (newRadius !== prev.zone.radius) {
          setZonePhase(prevPhase => prevPhase + 1);
        }
        
        return {
          ...prev,
          zone: {
            ...prev.zone,
            radius: newRadius,
            damagePerSecond: newDamage
          }
        };
      });
    }, 1000); // Zone shrinks every second
  };

  const startGameTimer = () => {
    gameTimeRef.current = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
  };

  const updateAI = () => {
    setPlayers(prevPlayers => {
return prevPlayers.map(p => {
        if (p.is_player || !p.is_alive) return p;
        
        // Simple AI: move towards center and shoot at player
        const centerX = currentMatch?.zone.center.x || 400;
        const centerY = currentMatch?.zone.center.y || 300;
        
        const dx = centerX - p.position.x;
        const dy = centerY - p.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          const moveX = p.position.x + (dx / distance) * 2;
          const moveY = p.position.y + (dy / distance) * 2;
          
          return {
            ...p,
            position: { x: moveX, y: moveY }
          };
        }
        
        return p;
      });
    });
  };

const checkGameEnd = () => {
    const alivePlayers = players.filter(p => p.is_alive);
    
    if (alivePlayers.length <= 1) {
      endGame(alivePlayers[0]);
    }
  };

  const endGame = async (winnerPlayer = null) => {
    // Clear all timers
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (zoneTimerRef.current) {
      clearInterval(zoneTimerRef.current);
      zoneTimerRef.current = null;
    }
    if (gameTimeRef.current) {
      clearInterval(gameTimeRef.current);
      gameTimeRef.current = null;
    }
    
    try {
if (currentMatch && winnerPlayer) {
        await matchService.update(currentMatch.Id, {
          state: 'ended',
          winner_id: winnerPlayer.Id,
          time_elapsed: gameTime
        });
      }
      setWinner(winnerPlayer);
      setGameState('gameOver');
      
if (winnerPlayer?.is_player) {
        toast.success('Victory! You are the last one standing!');
      } else {
        toast.error('Game Over! Better luck next time.');
      }
    } catch (err) {
      console.error('Error ending game:', err);
    }
  };

const handlePlayerMove = useCallback((newPosition) => {
    if (!player || !player.is_alive) return;
    
    setPlayer(prev => ({
      ...prev,
      position: newPosition
    }));
    
    setPlayers(prev => prev.map(p => 
      p.Id === player.Id ? { ...p, position: newPosition } : p
    ));
  }, [player]);

const handlePlayerShoot = useCallback((targetPosition) => {
    if (!player || !player.is_alive || player.ammo <= 0) return;
    
    // Check if hit any enemy
    const hitEnemy = players.find(p => {
      if (p.is_player || !p.is_alive) return false;
      
      const dx = p.position.x - targetPosition.x;
      const dy = p.position.y - targetPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance < 30; // Hit radius
    });
    if (hitEnemy) {
      const newHealth = hitEnemy.health - player.weapon.damage;
      
      if (newHealth <= 0) {
        // Enemy killed
setPlayers(prev => prev.map(p => 
          p.Id === hitEnemy.Id ? { ...p, health: 0, is_alive: false } : p
        ));
        setKills(prev => prev + 1);
        setPlayer(prev => ({ ...prev, kills: prev.kills + 1 }));
        toast.success(`Enemy eliminated! (+${player.weapon.damage} damage)`);
      } else {
        // Enemy damaged
        setPlayers(prev => prev.map(p => 
          p.Id === hitEnemy.Id ? { ...p, health: newHealth } : p
        ));
        toast.info(`Hit! ${player.weapon.damage} damage dealt`);
      }
    }
    
    // Reduce ammo
    setPlayer(prev => ({
      ...prev,
      ammo: Math.max(0, prev.ammo - 1)
    }));
  }, [player, players]);

const handleTakeDamage = useCallback((damage) => {
    if (!player || !player.is_alive) return;
    
    const newHealth = Math.max(0, player.health - damage);
    
setPlayer(prev => ({
      ...prev,
      health: newHealth,
      is_alive: newHealth > 0
    }));
    
setPlayers(prev => prev.map(p => 
      p.Id === player.Id ? { ...p, health: newHealth, is_alive: newHealth > 0 } : p
    ));
    
    if (newHealth <= 0) {
      toast.error('You have been eliminated!');
      endGame();
    }
  }, [player]);

  const restartGame = async () => {
try {
      // Reset game state locally
      setGameState('menu');
      setCurrentMatch(null);
      setWinner(null);
      setKills(0);
      setGameTime(0);
      setZonePhase(1);
    } catch (err) {
      toast.error('Failed to restart game');
    }
  };

  const returnToMenu = () => {
    // Clear timers
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (zoneTimerRef.current) {
      clearInterval(zoneTimerRef.current);
      zoneTimerRef.current = null;
    }
    if (gameTimeRef.current) {
      clearInterval(gameTimeRef.current);
      gameTimeRef.current = null;
    }
    
    restartGame();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (zoneTimerRef.current) clearInterval(zoneTimerRef.current);
      if (gameTimeRef.current) clearInterval(gameTimeRef.current);
    };
  }, []);

  // Zone damage effect
  useEffect(() => {
    if (gameState !== 'playing' || !player || !currentMatch) return;
    
    const checkZoneDamage = () => {
      const dx = player.position.x - currentMatch.zone.center.x;
      const dy = player.position.y - currentMatch.zone.center.y;
      const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
      
      if (distanceFromCenter > currentMatch.zone.radius) {
        handleTakeDamage(currentMatch.zone.damagePerSecond);
        toast.warning('Taking zone damage!');
      }
    };
    
    const zoneCheckInterval = setInterval(checkZoneDamage, 1000);
    
    return () => clearInterval(zoneCheckInterval);
  }, [gameState, player, currentMatch, handleTakeDamage]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-display text-error mb-4">Game Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg transition-colors"
          >
            Reload Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-hidden relative">
    <AnimatePresence mode="wait">
        {gameState === "menu" && <MainMenu key="menu" onStartGame={startGame} loading={loading} />}
        {gameState === "playing" && <motion.div
            key="game"
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            exit={{
                opacity: 0
            }}
            className="h-full relative">
            {/* Game Canvas */}
            <GameCanvas
                players={players}
                player={player}
                match={currentMatch}
                onPlayerMove={handlePlayerMove}
                onPlayerShoot={handlePlayerShoot} />
            {/* HUD Overlay */}
            <GameHUD
                player={player}
                gameTime={gameTime}
                zonePhase={zonePhase}
                kills={kills}
                playersAlive={players.filter(p => p.is_alive).length}
                onReturnToMenu={returnToMenu} />
            {/* Minimap */}
            <Minimap
                players={players}
                player={player}
                zone={currentMatch?.zone}
                className="absolute top-4 right-4" />
        </motion.div>}
        {gameState === "gameOver" && <GameOverScreen
            key="gameOver"
            winner={winner}
            player={player}
            gameTime={gameTime}
            kills={kills}
            onPlayAgain={startGame}
            onMainMenu={restartGame}
            loading={loading} />}
    </AnimatePresence>
</div>
  );
};

export default Game;