import React from 'react';

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  currentXP,
  nextLevelXP,
}) => {
  const progressPercentage = (currentXP / nextLevelXP) * 100;

  return (
    <div className='bg-light-transparent rounded-1 b-l2 p-2'>
      <div className='text-left'>
        <div className='font-8'>Level up by playing our games!</div>
        <div className='font-12'>You are level {currentLevel}.</div>
        <div className='font-8'>
          You have {currentXP} / {nextLevelXP} xp needed for the next level.
        </div>
        <div className='font-8'>
          Completed level: {progressPercentage.toFixed(2)}%.
        </div>
      </div>
      <div className='progress-container small width-full rounded-0 mt-2'>
        <div
          className='progress-bar rounded-0'
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default LevelProgress;
