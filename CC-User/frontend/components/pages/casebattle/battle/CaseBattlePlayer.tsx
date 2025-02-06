import React, { useState } from 'react';
import {
  ActiveEmoji,
  CaseBattleType,
  CasebattlePlayer,
} from '@/lib/client/types';
import CaseBattlePlayerEmojis from './CaseBattlePlayerEmojis';
import CaseBattleUserInfo from './CaseBattleUserInfo';
import BattleCardStatusZero from './BattleCardStatusZero';
import BattleCardSplash from './BattleCardSplash';
import BattleCardReel from './BattleCardReel';
import BattleCardResult from './BattleCardResult';

type Props = {
  player: CasebattlePlayer | undefined;
  creator: boolean;
  joined: boolean;
  currentUserId: string;
  onCallBotClick: (n: number) => void;
  onJoinClick: (n: number) => void;
  onLeaveClick: (n: number) => void;
  status: number;
  casebattle: CaseBattleType;
  position: number;
  onClickEmoji: (id: string, position: number, emoji: number) => void;
  activeEmoji: ActiveEmoji;
  round: number | null;
};

const CaseBattlePlayer: React.FC<Props> = ({
  player,
  creator,
  joined,
  currentUserId,
  onCallBotClick,
  onJoinClick,
  onLeaveClick,
  status,
  casebattle,
  position,
  onClickEmoji,
  activeEmoji,
  round,
}) => {
  const renderBattleCardContent = () => {
    if (status === 0) {
      return (
        <BattleCardStatusZero
          creator={creator}
          currentUserId={currentUserId}
          joined={joined}
          onCallBotClick={() => onCallBotClick(position)}
          onJoinClick={() => onJoinClick(position)}
          onLeaveClick={() => onLeaveClick(position)}
          player={player}
        />
      );
    } else if (status > 0 && status < 4) {
      return (
        <BattleCardSplash
          status={status}
          countdown={casebattle.data.countdown}
        />
      );
    } else if (status === 4) {
      return (
        <BattleCardReel
          casebattle={casebattle}
          position={position}
          round={round}
        />
      );
    } else {
      return (
        <BattleCardResult
          casebattle={casebattle}
          position={position}
          status={status}
        />
      );
    }
  };
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`flex row responsive bg-dark b-b2 p-2 rounded-1 width-full relative ${casebattle.mode === 3 ? 'twotwo' : 'individual'}`}
    >
      <div
        className='casebattle_rounditem joined flex column gap-2 width-full'
        data-position={position}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className='casebattle-container relative overflow-h'>
          <div className='casebattle-case relative width-full height-full'>
            <div className='bg-light rounded-0 relative width-full height-full overflow-h'>
              <div className='shadow vertically shadow-top'></div>
              <div className='shadow vertically shadow-bottom'></div>
              {renderBattleCardContent()}
            </div>
          </div>
          {
            <CaseBattlePlayerEmojis
              dataid={casebattle.id}
              onClickEmoji={onClickEmoji}
              position={position}
              activeEmoji={activeEmoji}
              hovered={hovered}
              isUser={player && player.user.userid === currentUserId}
            />
          }
        </div>
        <CaseBattleUserInfo user={player} />
      </div>
    </div>
  );
};

export default CaseBattlePlayer;
