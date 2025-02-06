import React from 'react';
import { CasebattlePlayer } from '@/lib/client/types';
import { useSession } from 'next-auth/react';

type BattleCardProps = {
  player?: CasebattlePlayer;
  joined: boolean;
  creator: boolean;
  currentUserId: string;
  onJoinClick: () => void;
  onCallBotClick: () => void;
  onLeaveClick: () => void;
};

const BattleCardStatusZero: React.FC<BattleCardProps> = ({
  player,
  joined,
  creator,
  currentUserId,
  onJoinClick,
  onCallBotClick,
  onLeaveClick,
}) => {
  const session = useSession();
  return player === undefined ? (
    <div className='flex column items-center justify-center gap-2 height-full'>
      <div className='text-bold text-space-1'>
        {joined
          ? 'WAITING FOR PLAYERS'
          : session.status !== 'unauthenticated'
            ? 'ARE YOU READY TO PLAY'
            : 'WAITING FOR PLAYERS'}
      </div>
      {!joined && session.status !== 'unauthenticated' ? (
        <button className='site-button purple' onClick={onJoinClick}>
          Join The Battle
        </button>
      ) : (
        creator && (
          <button className='site-button purple' onClick={onCallBotClick}>
            Call a Bot
          </button>
        )
      )}
    </div>
  ) : (
    <div className='flex column items-center justify-center gap-2 height-full'>
      <div className='text-bold text-success text-space-1'>READY TO BATTLE</div>
      {player.user.userid === currentUserId && (
        <button
          className='site-button purple'
          onClick={onLeaveClick}
          data-id='f88b902e9cb4dfaa93cd4d9f'
          data-position='0'
        >
          Leave The Battle
        </button>
      )}
    </div>
  );
};

export default BattleCardStatusZero;
