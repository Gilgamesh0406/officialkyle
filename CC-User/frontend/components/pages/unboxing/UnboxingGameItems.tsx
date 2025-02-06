import { UnboxingGameItem } from '@/lib/client/types';
import React from 'react';

type Props = {
  items: UnboxingGameItem[];
};

function UnboxingGameItems({ items }: Props) {
  return (
    <div className='flex column gap-2 mt-2 p-2'>
      <div className='text-left font-9'>This case contains:</div>
      <div className='unboxing-list' id='unboxing_list'>
        {items.map((item, idx) => (
          <div className='listing-item flex column' key={idx}>
            <div
              className='listing-slot rounded-0'
              style={{ borderBottom: 'solid 3px undefined !important' }}
            >
              <div className='item-chance text-right'>
                {item.chance.toFixed(2)}%
              </div>
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
              <div className='item-tickets text-right'>
                {item.tickets.min} - {item.tickets.max}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UnboxingGameItems;
