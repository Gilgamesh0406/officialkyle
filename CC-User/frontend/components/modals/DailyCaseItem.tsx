import { getFormatSeconds } from '@/lib/client/utils';
import { DailyCaseType } from '@/lib/client/types';
import React, { useEffect, useState } from 'react';

type Props = {
  dailyCase: DailyCaseType;
  level: number;
};

function DailyCaseItem({ dailyCase, level }: Props) {
  const [timer, setTimer] = useState(dailyCase.time);
  const [isDisabled, setIsDisabled] = useState(dailyCase.time > 0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          if (newTimer <= 0) {
            clearInterval(interval);
            setIsDisabled(false);
          }
          return newTimer;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const formattedTime = getFormatSeconds(timer);

  return (
    <div className='case-item flex column gap-1' data-id={dailyCase.id}>
      <div className='case-slot rounded-0'>
        <div className='case-image-content flex items-center justify-center p-2'>
          <img
            className='case-image transition-5'
            src={`/imgs/dailycases/${dailyCase.image}`}
            alt={dailyCase.name}
          />
        </div>

        <div className='case-name-content text-center ellipsis'>
          {dailyCase.name}
        </div>

        <div className='case-action-content'>
          {isDisabled ? (
            <button
              type='button'
              className='case-action dailycases-open site-button purple disabled'
              data-id={dailyCase.id}
            >
              {formattedTime.hours}:{formattedTime.minutes}:
              {formattedTime.seconds}
            </button>
          ) : (
            <button
              type='button'
              className='case-action dailycases-open site-button purple'
              data-id={dailyCase.id}
            >
              OPEN CASE (LVL. {level})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyCaseItem;
