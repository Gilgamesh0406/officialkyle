import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import InventoryItem from './InventoryItem';
import { InventoryItemType } from '@/lib/client/types';
type Props = {
  open: boolean;
  setOpen: (f: boolean) => void;
  items: InventoryItemType[];
  page: number;
  setPage: (n: number) => void;
  pages: number;
  total: number;
  sellItem: (i: string) => void;
  sellAllItems: () => void;
};

function InventoryModal({
  open,
  setOpen,
  items,
  page,
  setPage,
  pages,
  total,
  sellItem,
  sellAllItems,
}: Props) {
  return (
    <div
      className={`modal large active ${
        open ? 'opacity-100 z-[999]' : 'opacity-0 z-[-999]'
      }`}
    >
      <div className='modal-dialog flex justify-center items-center'>
        <div className='modal-content rounded-1'>
          <div className='modal-header flex items-center justify-between'>
            <div className='modal-title text-upper'>Inventory</div>
            <div
              className='modal-close flex justify-center items-center rounded-0'
              data-modal='hide'
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
          <div className='modal-body text-left'>
            <div className='flex row justify-between items-center gap-2 pt-2 pb-2 bb-l2'>
              <div className='bg-light p-2 rounded-0 flex'>
                Value: <span id='inventory_value'>{total}</span>
                <img style={{ height: 25 }} src='/imgs/coins.webp' />
              </div>

              <button
                className='site-button purple'
                id='inventory_sell_all'
                onClick={() => sellAllItems()}
              >
                Sell All
              </button>
            </div>
            <div id='inventory_list'>
              {items.map((item, index) => (
                <InventoryItem
                  key={index}
                  item={item.item}
                  sellItem={sellItem}
                />
              ))}
            </div>
            <div className='flex items-center justify-center bg-dark p-2 bt-l2'>
              <div
                className='pagination-content flex row gap-2 width-full'
                id='pagination_inventory_items'
              >
                <div className='flex row gap-2 justify-between items-center width-full'>
                  <div
                    className='pagination-item flex items-center justify-center'
                    onClick={() => {
                      if (page > 1) {
                        setPage(page - 1);
                      }
                    }}
                  >
                    «
                  </div>
                  <div className='bg-light rounded-1 b-l2 pl-2 pr-2 flex row items-center justify-center height-full'>
                    {page}/{pages}
                  </div>
                  <div
                    className='pagination-item flex items-center justify-center'
                    onClick={() => {
                      if (page < pages) {
                        setPage(page + 1);
                      }
                    }}
                  >
                    »
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryModal;
