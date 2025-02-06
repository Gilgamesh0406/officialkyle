import { UnboxingHistoryItemType } from '@/lib/client/types';
import React from 'react';

type Props = {
  item: UnboxingHistoryItemType;
};

function UnboxingHistoryItem({ item }: Props) {
  const style = {
    border: '2px solid undefined80',
    background:
      'linear-gradient(to top, undefined80 0%, var(--site-color-bg-dark-transparent) 100%)',
  };

  return item ? (
    <div
      className='history-container medium success rounded-1 p-1 fade_center'
      style={style}
    >
      <a
        href={'/unboxing/' + item.unboxing.id}
        target='_blank'
        className='keychainify-checked'
      >
        <div className='history-content unboxing flex justify-center items-center'>
          <div className='unboxing transition-5'>
            <img className='image' src={item.winning.image} />
            <div className='chance text-bold text-right pr-1'>
              {item.winning.chance.toFixed(2)}%
            </div>
            <div className='chance text-bold text-left pr-2'>
              {item.user.name}
            </div>
            <div className='name text-left pl-1'>
              <div className='text-bold'>{item.winning.name}</div>
            </div>
            <div className='price text-right pr-1'>
              <div className='coins-mini mr-1'></div>
              {item.winning.price.toFixed(2)}
            </div>
          </div>
          <div className='case transition-5'>
            <img className='image' src={item.unboxing.image} />
            <div className='name text-bold'>{item.unboxing.name}</div>
            <div className='price'>
              <div className='coins mr-1'></div>
              {item.unboxing.price}
            </div>
            <div className='absolute top-0 bottom-0 left-0 right-0 p-1 flex items-center justify-center height-full gap-1'>
              <div className='avatar-field rounded-full  tier-bronze relative'>
                <img
                  className='avatar icon-medium rounded-full'
                  src={item.user.avatar}
                />
                <div className='level sup-medium-left flex justify-center items-center b-d2 bg-dark rounded-full'>
                  {item.user.level}
                </div>
              </div>
              <div className='text-left ellipsis'>{item.user.name}</div>
            </div>
          </div>
        </div>
      </a>
    </div>
  ) : (
    <></>
  );
}

export default UnboxingHistoryItem;
