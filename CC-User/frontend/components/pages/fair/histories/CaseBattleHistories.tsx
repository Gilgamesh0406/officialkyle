import React, { useEffect, useState } from 'react';
import { formatTimeFromStringTimestamp, handleCopy } from '@/lib/client/utils';
import CaseBattleResultModal from '@/components/modals/CaseBattleResultsModal';

type Props = {
  records: any[];
};

export default function CaseBattleHistories({ records }: Props) {
  const [rollData, setRollData] = useState<string>('');
  const checkRoll = (data: string) => {
    setRollData(data);
  };
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (rollData && open === false) {
      setOpen(true);
    }
  }, [rollData]);
  useEffect(() => {
    if (open === false) {
      setRollData('');
    }
  }, [open]);
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
            onClick={() => handleCopy(record.casebattle_rolls[0].public_seed)}
          >
            {record.casebattle_rolls[0].public_seed}
          </div>
          <div
            className='table-column text-left pointer'
            onClick={() => handleCopy(record.casebattle_rolls[0].blockid)}
          >
            {record.casebattle_rolls[0].blockid}
          </div>
          <div className='table-column text-left pointer'>
            <button
              className='site-button purple fair-results-casebattle'
              onClick={() => checkRoll(record.casebattle_rolls[0].roll)}
            >
              Check
            </button>
          </div>
          <div className='table-column text-left'>
            {formatTimeFromStringTimestamp(record.time)}
          </div>
        </div>
      ))}
      <CaseBattleResultModal
        data={rollData}
        isOpen={open}
        setIsOpen={setOpen}
      />
    </div>
  );
}
