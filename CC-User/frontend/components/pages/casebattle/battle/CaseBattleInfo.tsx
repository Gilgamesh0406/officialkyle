import { CaseBattleBetType } from '@/lib/client/types';
import React from 'react';

type Props = {
  battle: CaseBattleBetType | undefined;
};

function CaseBattleInfo({ battle }: Props) {
  if (!battle) {
    return null;
  }
  return (
    <div className='casebattle-game bg-dark width-full flex row gap-2 items-center relative'>
      <div className='casebattle-round casebattle_game_round rounded-full flex justify-center items-center text-bold active'>
        {battle.casebattle.data.round ? battle.casebattle.data.round + 1 : 1}
      </div>

      <div
        className='flex column justify-center items-start gap-2'
        style={{ minWidth: '100px' }}
      >
        <div className='font-6 text-bold'>BATTLE ROUNDS</div>
        <div className='font-4'>
          <span className='casebattle_game_round'>
            {battle.casebattle.data.round + 1}
          </span>{' '}
          OF{' '}
          <span className='casebattle_game_rounds'>
            {battle.casebattle.cases && battle.casebattle.cases.length}
          </span>
        </div>
      </div>

      <div className='width-full overflow-h'>
        <div
          className='width-full flex row gap-1 p-1 transition-2'
          id='casebattle_roundslist'
        >
          {battle.casebattle.cases &&
            battle.casebattle.cases.map((batCase, index) => (
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
    </div>
  );
}

export default CaseBattleInfo;
