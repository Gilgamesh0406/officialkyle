import AvatarField from '@/components/common/AvatarField';
import { CaseBattleBetType } from '@/lib/client/types';
import { getPlayersCountForCaseBattle } from '@/lib/client/utils';
import { useSession } from 'next-auth/react';
import React from 'react';

interface CaseBattleBetItemProps {
  bet: CaseBattleBetType;
}

const CaseBattleBetItem: React.FC<CaseBattleBetItemProps> = ({ bet }) => {
  const playersCount = getPlayersCountForCaseBattle(bet.casebattle.mode);
  const session = useSession();
  return (
    <div
      className='casebattle_betitem bg-light flex justify-center items-center row responsive gap-2 relative fade_center'
      data-id={bet.casebattle.id}
      data-cases={JSON.stringify(bet.casebattle.cases)}
      data-players={playersCount}
      data-amount={bet.casebattle.amount}
      data-time={bet.casebattle.time}
    >
      <div className='casebattle-round rounded-full flex justify-center items-center text-bold danger'>
        {bet.casebattle.cases.length}
      </div>
      <div className='width-2 responsive pr-4 pl-4'>
        <div className='flex row gap-4 justify-center items-center'>
          <div className='flex row gap-2'>
            {Array.from({ length: playersCount }).map((_, index) => {
              const player = bet.casebattle.players.find(
                (p) => p.position === index
              );

              return player ? (
                <AvatarField key={index} type='small' user={player.user} />
              ) : (
                <div
                  key={index}
                  className='avatar icon-small bd-1 bg-dark rounded-full'
                ></div>
              );
            })}
          </div>
          <div className='font-6 text-bold text-space-2'>
            <span className='text-success'>
              {bet.casebattle.players.length}
            </span>
            /{playersCount}
          </div>
        </div>
      </div>
      <div className='width-7 responsive bg-dark overflow-h'>
        <div
          className='casebattle-roundslist flex row gap-1 rounded-0 p-1 transition-2'
          style={{ transform: 'translateX(0px)' }}
        >
          {bet.casebattle.cases.map((batCase, index) => (
            <div
              key={index}
              className='casebattle-icon small bg-light rounded-0 p-1 bl-1 flex justify-center items-center'
              title={batCase.name}
            >
              <img src={`/imgs/cases/${batCase.image}`} alt={batCase.name} />
            </div>
          ))}
        </div>
      </div>
      <div className='font-6 text-bold text-space-1 width-1 responsive flex justify-center items-center p-1'>
        ${bet.casebattle.amount.toFixed(2)}
      </div>
      <div className='width-2 responsive pr-4 pl-4 pt-2 pb-2'>
        <a
          className='site-button black width-full height-full'
          href={`/casebattle/${bet.casebattle.id}`}
        >
          {bet.status === 0
            ? session.status !== 'unauthenticated'
              ? 'Join'
              : 'View'
            : 'View'}{' '}
          the classic battle
        </a>
      </div>
    </div>
  );
};

export default CaseBattleBetItem;
