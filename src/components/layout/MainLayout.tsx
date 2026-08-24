import React from 'react';
import { TopNav } from '../navigation/TopNav';
import { SceneType } from '../../app/routes';

interface MainLayoutProps {
  children: React.ReactNode;
  currentScene: SceneType;
  onSceneChange: (scene: SceneType) => void;
}

export const MainLayout = ({ children, currentScene, onSceneChange }: MainLayoutProps) => {
  return (
    <div className="relative w-full h-full bg-[var(--color-bg-primary)]">
      {/* 3D Canvas Background Layer */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>
      
      {/* Navigation Layer */}
      <TopNav currentScene={currentScene} onSceneChange={onSceneChange} />
    </div>
  );
};
