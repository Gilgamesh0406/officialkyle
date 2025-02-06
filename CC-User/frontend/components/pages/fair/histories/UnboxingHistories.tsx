import { PlinkoAndUnboxingFairHistoryType } from '@/lib/client/types';
import { handleCopy } from '@/lib/client/utils';
import React from 'react';

type Props = {
  history: PlinkoAndUnboxingFairHistoryType[];
};

function UnboxingHistories({ history }: Props) {
  return (
    <div className='table-body'>
      {history.map((record) => (
        <div className='table-row' key={record.id}>
          <div className='table-column text-left'>{record.id}</div>
          <div
            className='table-column text-left pointer text-danger'
            onClick={() => handleCopy(record.server_seed)}
          >
            (hashed) {record.server_seed}
          </div>
          <div
            className='table-column text-left pointer'
            onClick={() => handleCopy(record.client_seed)}
          >
            {record.client_seed}
          </div>
          <div
            className='table-column text-left pointer'
            onClick={() => handleCopy(record.nonce)}
          >
            {record.nonce}
          </div>
          <div
            className='table-column text-left pointer'
            onClick={() => handleCopy(record.tickets ? record.tickets : '')}
          >
            {record.tickets}
          </div>
          <div
            className='table-column text-left pointer'
            onClick={() => handleCopy(record.roll)}
          >
            {record.roll}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UnboxingHistories;
