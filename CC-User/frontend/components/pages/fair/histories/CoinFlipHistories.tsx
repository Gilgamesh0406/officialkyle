import { CoinflipHistoryRecord } from '@/lib/client/types';
import React from 'react';
import { formatTimeFromStringTimestamp, handleCopy } from '@/lib/client/utils';

type Props = {
  records: CoinflipHistoryRecord[];
};

export default function CoinFlipHistories({ records }: Props) {
  return (
    <div className='table-body'>
      {records.map((record) => (
        <div className='table-row' key={record.id}>
          <div className='table-column text-left'>{record.id}</div>
          <div
            className='table-column text-left pointer'
            onClick={() => handleCopy(record.server_seed)}
          >
            {record.server_seed}
          </div>
          <div
            className='table-column text-left pointer'
            onClick={() => handleCopy(record.coinflip_rolls[0]?.public_seed)}
          >
            {record.coinflip_rolls[0]?.public_seed}
          </div>
          <div
            className='table-column text-left pointer'
            onClick={() => handleCopy(record.coinflip_rolls[0]?.blockid)}
          >
            {record.coinflip_rolls[0]?.blockid}
          </div>
          <div
            className='table-column text-left pointer'
            onClick={() =>
              handleCopy(record.coinflip_rolls[0]?.roll.toString())
            }
          >
            {record.coinflip_rolls[0]?.roll}
          </div>
          <div className='table-column text-left'>
            {formatTimeFromStringTimestamp(record.time)}
          </div>
        </div>
      ))}
    </div>
  );
}
