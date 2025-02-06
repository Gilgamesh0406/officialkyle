import { CaseBattleCase } from '@/lib/client/types';
import React from 'react';

type Props = {
  item: CaseBattleCase;
  sellItem: (i: string) => void;
};

function InventoryItem({ item, sellItem }: Props) {
  console.log('inventory item', item);
  return (
    <div className='listing-item inventory_item flex column ' data-id={item.id}>
      <div
        className='listing-slot rounded-0'
        style={{ borderBottom: 'solid 3px undefined !important' }}
      >
        <div className='item-inventory-settings transition-5'>
          <div className='flex column gap-2 items-center justify-center height-full width-full'>
            <button
              className='site-button purple inventory_sell_item'
              data-id={item.id}
              onClick={() => {
                sellItem(item.id);
              }}
            >
              SELL ITEM
            </button>
          </div>
        </div>
        <div className='item-image-content flex items-center justify-center p-2'>
          <img className='item-image transition-5' src={item.image} />
        </div>
        <div className='item-name-content text-left'>
          <div className='item-brand ellipsis'>{item.name}</div>
        </div>
        <div className='item-price text-left'>
          <div className='coins'></div> {item.price}
        </div>
      </div>
    </div>
  );
}

export default InventoryItem;
