import { UnboxingHistoryItemType } from '@/lib/client/types';
import React from 'react';
import UnboxingHistoryItem from './UnboxingHistoryItem';

type Props = {
  items: UnboxingHistoryItemType[] | undefined;
};

function UnboxingHistory({ items }: Props) {
  if (items && items.length > 0) {
    return (
      <div className='width-14 inline-table -mt-2 -ml-4 -mr-4 px-2'>
        <div className='width-full inline-grid'>
          <div
            className='panel-histories medium flex gap-1 p-2'
            id='unboxing_history'
          >
            {items.map((item, idx) => (
              <UnboxingHistoryItem item={item} key={idx} />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='w-full width-full h-32 flex justify-center items-center'>
        Loading histories
      </div>
    );
  }
}

export default UnboxingHistory;
