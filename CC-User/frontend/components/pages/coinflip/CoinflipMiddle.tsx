import { Coinflip } from '@/lib/client/types';
import React, { useEffect, useState } from 'react';

type CoinflipMiddleProps = {
  status: number;
  coinflip: Coinflip;
  showFairFor: (cf: Coinflip) => void;
  timer: any;
};

export const CoinflipMiddle: React.FC<CoinflipMiddleProps> = React.memo(
  ({ status, coinflip, showFairFor, timer }) => {
    return (
      <div className='flex justify-center items-center relative p-2'>
        {status === 0 && <div className='text-bold font-10'>VS</div>}
        {status === 1 && (
          <div className='b-d2 bg-dark rounded-full flex justify-center items-center text-bold p-4 font-11'>
            <div className='absolute' id={`coinflip_timer_${coinflip.id}`}>
              {timer}
            </div>
          </div>
        )}
        {status === 2 && <div className='text-bold font-10'>EOS</div>}
        {status === 3 && (
          <div className='flex justify-center items-center relative'>
            <div
              className={`coinflip-coin coinflip-coin-animation-${coinflip.data.winner}`}
            >
              <div className='front absolute top-0 bottom-0 left-0 right-0'></div>
              <div className='back absolute top-0 bottom-0 left-0 right-0'></div>
            </div>
          </div>
        )}
        {status === 4 && (
          <div className='flex justify-center items-center relative'>
            <div className={`coinflip-pick-${coinflip.data.winner}`}></div>
          </div>
        )}
        <div
          className='coinflip-fair pointer absolute bottom-0 font-5 fair-results'
          data-fair={JSON.stringify({ game: coinflip.data, draw: null })}
          onClick={() => showFairFor(coinflip)}
        >
          Provably fair
        </div>
      </div>
    );
  }
);
