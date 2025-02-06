import { BotType } from '@/lib/client/types';
import React from 'react';
import AvatarField from './AvatarField';
import Link from 'next/link';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
type Props = {
  bot: BotType;
  selected: boolean;
  selectBot: () => void;
};

function GameBot({ bot, selected, selectBot }: Props) {
  return (
    <div>
      <div
        className={`gamebot-item bg-light rounded-1 b-l2 pl-4 pr-4 ${selected && 'active'}`}
        onClick={selectBot}
      >
        <div className='gamebot-selected flex justify-center items-center font-8 right-0'>
          <FontAwesomeIcon icon={faCheck} className='w-[16px]' />
        </div>
        <div className='flex row items-center gap-2 height-full'>
          <AvatarField type='medium' user={bot.user} />
          <div className='flex column gap-1 items-start'>
            <div className='flex column items-start'>
              <div className='gamebot-name'>{bot.user.name}</div>
              <Link
                className='gamebot-profile'
                href={`/profile/${bot.user.userid}`}
                target='_black'
              >
                Profile
              </Link>
            </div>
            <div className='gamebot-rate'>
              Winning Rate: {((bot.winnings * 100) / bot.bets).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameBot;
