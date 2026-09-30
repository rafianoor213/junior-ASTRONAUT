'use client';

import React, { useState, useEffect } from 'react';
import { StarfieldBackground } from '@/components/StarfieldBackground';
import { TopHUD } from '@/components/TopHUD';
import { MissionControlHUD } from '@/components/MissionControlHUD';
import { MainMenu } from '@/components/MainMenu';
import { Level1Training } from '@/components/Level1Training';
import { LaunchIntermission } from '@/components/LaunchIntermission';
import { Level2Survival } from '@/components/Level2Survival';
import { Level3Return } from '@/components/Level3Return';
import { MissionSuccess } from '@/components/MissionSuccess';
import { MissionFailure } from '@/components/MissionFailure';
import { GameMetrics, GameScreen } from '@/types/game';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('MAIN_MENU');
  const [lastActiveLevel, setLastActiveLevel] = useState<GameScreen>('LEVEL1_TRAINING');

  // Metrics & State
  const [metrics, setMetrics] = useState<GameMetrics>({
    score: 0,
    missionTime: 0,
    levelsUnlocked: {
      level1: true,
      level2: false,
      level3: false,
    },
    playerName: 'CADET ALEX',
    badges: [],
    failureReason: '',
  });

  // HUD Mission Control & Objectives State
  const [missionControlMsg, setMissionControlMsg] = useState<string>('');
  const [objectives, setObjectives] = useState<{ id: string; label: string; completed: boolean }[]>([]);

  // Mission Timer Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (['LEVEL1_TRAINING', 'LEVEL2_SURVIVAL', 'LEVEL3_RETURN'].includes(currentScreen)) {
      timer = setInterval(() => {
        setMetrics((m) => ({ ...m, missionTime: m.missionTime + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentScreen]);

  // Score Updater Helper
  const handleUpdateScore = (deltaScore: number) => {
    setMetrics((m) => ({ ...m, score: Math.max(0, m.score + deltaScore) }));
  };

  // Screen Switcher
  const handleStartGameScreen = (screen: GameScreen) => {
    if (['LEVEL1_TRAINING', 'LEVEL2_SURVIVAL', 'LEVEL3_RETURN'].includes(screen)) {
      setLastActiveLevel(screen);
    }
    setCurrentScreen(screen);
  };

  // Level 1 Completion Callback
  const handleCompleteLevel1 = () => {
    setMetrics((m) => ({
      ...m,
      levelsUnlocked: { ...m.levelsUnlocked, level2: true },
    }));
    setCurrentScreen('LAUNCH_INTERMISSION');
  };

  // Launch Intermission Completion Callback
  const handleCompleteLaunch = () => {
    setLastActiveLevel('LEVEL2_SURVIVAL');
    setCurrentScreen('LEVEL2_SURVIVAL');
  };

  // Level 2 Completion Callback
  const handleCompleteLevel2 = () => {
    setMetrics((m) => ({
      ...m,
      levelsUnlocked: { ...m.levelsUnlocked, level3: true },
    }));
    setLastActiveLevel('LEVEL3_RETURN');
    setCurrentScreen('LEVEL3_RETURN');
  };

  // Level 3 Completion Callback
  const handleCompleteLevel3 = () => {
    setCurrentScreen('MISSION_SUCCESS');
  };

  // Mission Failure Callback
  const handleFailLevel = (reason: string) => {
    setMetrics((m) => ({ ...m, failureReason: reason }));
    setCurrentScreen('MISSION_FAILURE');
  };

  // Retry Callback
  const handleRetry = () => {
    setCurrentScreen(lastActiveLevel);
  };

  return (
    <main className="game-container">
      {/* Animated Canvas Starfield Backdrop */}
      <StarfieldBackground
        speedMultiplier={currentScreen === 'LAUNCH_INTERMISSION' ? 3 : 1}
        showMoon={currentScreen === 'MAIN_MENU' || currentScreen === 'LEVEL2_SURVIVAL'}
      />

      {/* Top Telemetry HUD Header (when inside gameplay or intermission) */}
      {currentScreen !== 'MAIN_MENU' && currentScreen !== 'MISSION_SUCCESS' && currentScreen !== 'MISSION_FAILURE' && (
        <TopHUD
          currentScreen={currentScreen}
          score={metrics.score}
          missionTime={metrics.missionTime}
          onOpenMenu={() => setCurrentScreen('MAIN_MENU')}
        />
      )}

      {/* Screen Render Switcher */}
      {currentScreen === 'MAIN_MENU' && (
        <MainMenu
          metrics={metrics}
          onStartGame={handleStartGameScreen}
        />
      )}

      {currentScreen === 'LEVEL1_TRAINING' && (
        <Level1Training
          onCompleteLevel1={handleCompleteLevel1}
          onUpdateScore={handleUpdateScore}
          setMissionControlMsg={setMissionControlMsg}
          setObjectives={setObjectives}
        />
      )}

      {currentScreen === 'LAUNCH_INTERMISSION' && (
        <LaunchIntermission
          onCompleteLaunch={handleCompleteLaunch}
        />
      )}

      {currentScreen === 'LEVEL2_SURVIVAL' && (
        <Level2Survival
          onCompleteLevel2={handleCompleteLevel2}
          onFailLevel={handleFailLevel}
          onUpdateScore={handleUpdateScore}
          setMissionControlMsg={setMissionControlMsg}
          setObjectives={setObjectives}
        />
      )}

      {currentScreen === 'LEVEL3_RETURN' && (
        <Level3Return
          onCompleteLevel3={handleCompleteLevel3}
          onFailLevel={handleFailLevel}
          onUpdateScore={handleUpdateScore}
          setMissionControlMsg={setMissionControlMsg}
          setObjectives={setObjectives}
        />
      )}

      {currentScreen === 'MISSION_SUCCESS' && (
        <MissionSuccess
          metrics={metrics}
          onPlayAgain={() => {
            setMetrics((m) => ({ ...m, score: 0, missionTime: 0 }));
            setCurrentScreen('MAIN_MENU');
          }}
        />
      )}

      {currentScreen === 'MISSION_FAILURE' && (
        <MissionFailure
          reason={metrics.failureReason}
          onRetry={handleRetry}
          onReturnMenu={() => setCurrentScreen('MAIN_MENU')}
        />
      )}

      {/* Bottom Left Mission Control & Objectives HUD */}
      {['LEVEL1_TRAINING', 'LEVEL2_SURVIVAL', 'LEVEL3_RETURN'].includes(currentScreen) && (
        <MissionControlHUD
          message={missionControlMsg}
          objectives={objectives}
        />
      )}
    </main>
  );
}
