import { UserLevel as UserLevelType } from '@/lib/client/types';
import React from 'react';

function UserLevel({ level, start, next, have }: UserLevelType) {
  return (
    <div className='level-bar flex items-center gap-1'>
      <div className='text-bold'>
        Level <span id='level_count'>{level}</span>
      </div>

      <div className='progress-container rounded-0'>
        <div
          className='progress-bar transition-2 linear rounded-0'
          id='level_bar'
        ></div>
        <div className='progress-content flex justify-center items_center text-bold'>
          <span id='level_have'>{have}</span> /{' '}
          <span id='level_next'>{next}</span>
        </div>
      </div>
    </div>
  );
}

export default UserLevel;
