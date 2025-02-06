import React from 'react';

type Props = {
  bet: (game: string) => void;
};

function PlinkoBet({ bet }: Props) {
  return (
    <div className='grid split-column-3 width-full gap-1'>
      <button
        className='site-button low width-full plinko_bet'
        data-game='low'
        onClick={() => bet('low')}
      >
        LOW RISK
      </button>
      <button
        className='site-button medium width-full plinko_bet'
        data-game='medium'
        onClick={() => bet('medium')}
      >
        MEDIUM RISK
      </button>
      <button
        className='site-button high width-full plinko_bet'
        data-game='high'
        onClick={() => bet('high')}
      >
        HIGH RISK
      </button>
    </div>
  );
}

export default PlinkoBet;
