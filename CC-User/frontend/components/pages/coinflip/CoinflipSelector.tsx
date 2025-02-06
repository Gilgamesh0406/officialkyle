import React from 'react';

type CoinflipSelectorProps = {
  activeBattleList: number;
  setActiveBattleList: (value: number) => void;
  onCreateGame: () => void;
  isCreateDisabled?: boolean;
};

const CoinflipSelector: React.FC<CoinflipSelectorProps> = ({
  activeBattleList,
  setActiveBattleList,
  onCreateGame,
  isCreateDisabled = true,
}) => {
  return (
    <div className='flex responsive items-center justify-between gap-2'>
      <div className='flex items-center justify-between gap-4 m-a'>
        <div
          onClick={() => setActiveBattleList(0)}
          className={`${
            activeBattleList === 0 ? 'active' : ''
          } icon-medium rounded-full transition-5 coinflip-select cursor-pointer`}
          data-position='0'
        >
          <img src='/imgs/coinflip/coin0.png' alt='Coin 0' />
        </div>
        <div
          onClick={() => setActiveBattleList(1)}
          className={`${
            activeBattleList === 1 ? 'active' : ''
          } icon-medium rounded-full transition-5 coinflip-select cursor-pointer`}
          data-position='1'
        >
          <img src='/imgs/coinflip/coin1.png' alt='Coin 1' />
        </div>
      </div>

      <button
        className='site-button purple'
        id='coinflip_create'
        onClick={onCreateGame}
        disabled={isCreateDisabled}
      >
        Create Game
      </button>
    </div>
  );
};

export default CoinflipSelector;
