import { CasebattlePlayer } from '@/lib/client/types';
import React from 'react';

type Props = {
  player: CasebattlePlayer | undefined;
  caseCount: number;
};

function CaseBattleItem({ player, caseCount }: Props) {
  return (
    <div className='casebattle-drops' data-position='0'>
      {Array.from({
        length: caseCount,
      }).map((_, index) => {
        const item = player?.items[index];
        if (item) {
          return (
            <div
              className='listing-item flex column'
              key={'casebattle_item_' + index}
            >
              <div className='listing-slot rounded-0'>
                <div className='item-image-content flex items-center justify-center p-2'>
                  <img className='item-image transition-5' src={item.image} />
                </div>
                <div className='item-name-content text-left'>
                  <div className='item-brand ellipsis'>{item.name}</div>
                </div>
                <div className='item-price text-left'>
                  <div className='coins mr-1'></div>
                  {item.price.toFixed(2)}
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div
              className='listing-item flex column'
              key={'casebattle_item_' + index}
            >
              <div className='bg-light-transparent height-full width-full rounded-0'></div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default CaseBattleItem;
