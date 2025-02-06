import { ActiveEmoji } from '@/lib/client/types';
import React from 'react';

type Props = {
  position: number;
  dataid: string;
  onClickEmoji: (id: string, position: number, emoji: number) => void;
  activeEmoji: ActiveEmoji;
  hovered: boolean;
  isUser: boolean | undefined;
};

const emojis = [
  'heart_eyes.png',
  'innocent.png',
  'rage.png',
  'sob.png',
  'joy.png',
];

const CaseBattlePlayerEmojis: React.FC<Props> = ({
  onClickEmoji,
  dataid,
  position,
  activeEmoji,
  hovered,
  isUser,
}) => {
  const isActivePosition = activeEmoji.position === position;
  const shouldShowEmojis = (hovered && isUser) || isActivePosition;

  return (
    <div
      className={`casebattle-emojis transition-2 width-full ${shouldShowEmojis ? 'active' : ''}`}
      style={{ opacity: shouldShowEmojis ? 1 : 0 }}
    >
      <div
        className={`casebattle-emojis-arena ${isActivePosition ? 'active' : ''}`}
      >
        {isActivePosition && (
          <div className='casebattle-emoji rounded-full'>
            <img
              className='height-full'
              src={`/imgs/emojis/${emojis[activeEmoji.emoji]}`}
              alt='active emoji'
            />
          </div>
        )}
      </div>

      {isUser && (
        <div className='casebattle-emojis-list flex row'>
          {emojis.map((emoji, index) => (
            <div
              key={index}
              className='casebattle-emoji width-full height-full p-2 rounded-full'
              onClick={() => onClickEmoji(dataid, position, index)}
            >
              <img
                className='height-full'
                src={`/imgs/emojis/${emoji}`}
                alt={`emoji ${index}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseBattlePlayerEmojis;
