import { UserGameResultData } from '@/lib/client/types';
import React from 'react';
interface Props {
  userData: UserGameResultData;
}
const UserGameResult: React.FC<Props> = ({ userData }) => {
  const { username, userId, avatarUrl, winAmount, betAmount, profitAmount } =
    userData;
  return (
    <div className='flex column gap-2 bg-light-transparent rounded-1 b-l2 p-2'>
      <div className='flex column justify-center gap-2'>
        <div className='avatar-field tier-steel'>
          <div className='inline-block relative'>
            <img
              className='avatar icon-large rounded-full'
              src={avatarUrl}
              alt={`${username}'s avatar`}
            />
          </div>
        </div>
        <div>
          <div className='flex justify-center gap-2 text-upper text-bold ellipsis'>
            <div className='chat-link-member'>member</div>
            <div>{username}</div>
          </div>
          <div className='ellipsis font-6'>
            {username} ({userId})
          </div>
        </div>
      </div>
      <div className='flex responsive justify-center items-center'>
        <div className='flex column items-center justify-center'>
          <div className='text-color font-10'>{winAmount?.toFixed(2)}</div>
          <div>WIN</div>
        </div>
        <div className='bg-main-transparent rounded-full b-m2 p-3 ml-2 mr-2 flex justify-center items-center text-bold font-8'>
          <div className='absolute'>-</div>
        </div>
        <div className='flex column items-center justify-center'>
          <div className='text-color font-10'>{betAmount?.toFixed(2)}</div>
          <div>BET</div>
        </div>
        <div className='bg-main-transparent rounded-full b-m2 p-3 ml-2 mr-2 flex justify-center items-center text-bold font-8'>
          <div className='absolute'>=</div>
        </div>
        <div className='flex column items-center justify-center'>
          <div className='text-color font-10 flex'>
            {profitAmount?.toFixed(2)}
            <img style={{ height: 25 }} src='/imgs/coins.webp' alt='Coins' />
          </div>
          <div>PROFIT</div>
        </div>
      </div>
    </div>
  );
};

export default UserGameResult;
