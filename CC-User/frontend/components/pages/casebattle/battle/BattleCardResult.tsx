import { CaseBattleType } from '@/lib/client/types';
import { getFormatAmount, getFormatAmountString } from '@/lib/client/utils';
import React from 'react';

type Props = {
  status: number;
  position: number;
  casebattle: CaseBattleType;
};

const BattleCardResult: React.FC<Props> = ({
  status,
  position,
  casebattle,
}) => {
  if (!casebattle.data.winners) {
    return;
  }
  const isWinner = casebattle.data.winners.includes(position);

  let content;

  if (status === 5) {
    content = (
      <div className='text-bold text-space-1'>
        {isWinner ? 'DRAW' : <span className='text-danger'>LOSER</span>}
      </div>
    );
  } else if (status === 6) {
    if (isWinner) {
      const total = casebattle.players.reduce((acc, val) => acc + val.total, 0);
      let winnings = total;

      if (casebattle.mode === 3) {
        winnings = [
          getFormatAmount(total / 2),
          getFormatAmount(total - getFormatAmount(total / 2)),
        ][position % 2];
      }

      content = (
        <div className='flex column gap-2 text-bold text-success text-space-1'>
          <div>WINNER</div>
          <div className='flex'>
            TOTAL WIN{' '}
            <img
              style={{ height: '25px' }}
              src='/imgs/coins.webp'
              alt='Coins'
            />{' '}
            {getFormatAmountString(winnings)}
          </div>
        </div>
      );
    } else {
      content = <div className='text-bold text-danger text-space-1'>LOSER</div>;
    }
  }

  return (
    <div className='flex column items-center justify-center gap-2 height-full'>
      {content}
    </div>
  );
};

export default BattleCardResult;
