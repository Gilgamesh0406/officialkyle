import { CasebattlePlayer } from '@/lib/client/types';
import React from 'react';

type Props = {
  user: CasebattlePlayer | undefined;
};

function CaseBattleUserInfo({ user }: Props) {
  return (
    <div className='casebattle-user flex row justify-between items-center gap-2 '>
      <div className='flex items-center gap-1'>
        <div
          className={`avatar-field rounded-full  ${user && 'tier-bronze'} relative`}
        >
          <img
            className='avatar icon-small rounded-full'
            src={
              user
                ? user.user.avatar
                : 'https://crazycargo.gg/template/img/avatar.jpg'
            }
          />
          {user && (
            <div className='level sup-small-left flex justify-center items-center b-d2 bg-dark rounded-full'>
              {user.user.level}
            </div>
          )}
        </div>
        <div className='text-left width-full ellipsis'>
          {user ? user.user.name : 'None'}
        </div>
      </div>
      <div className='text-bold '>
        <div className='coins mr-1'></div>
        <span className='casebattle-total'>
          {user ? user.total.toFixed(2) : '0.00'}
        </span>
      </div>
    </div>
  );
}

export default CaseBattleUserInfo;
