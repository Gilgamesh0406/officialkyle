import React, { useEffect, useState } from 'react';

type Props = {
  status: number;
  countdown?: number;
  battleId?: string;
  position?: number;
};

const BattleCardSplash: React.FC<Props> = ({
  status,
  countdown = 3,
  battleId,
  position,
}) => {
  const [timer, setTimer] = useState(countdown);

  useEffect(() => {
    if (status === 3 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          if (newTimer <= 0) {
            clearInterval(interval);
          }
          return newTimer;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [status, timer]);

  return (
    <div className='flex column items-center justify-center gap-2 height-full'>
      {status === 1 && (
        <div className='text-bold text-success text-space-1'>
          READY TO BATTLE
        </div>
      )}

      {status === 2 && <div className='eospicture'></div>}

      {status === 3 && (
        <div
          className='text-bold text-success text-space-1 font-20'
          id={`casebattle_timer_${battleId}_${position}`}
        >
          {timer}
        </div>
      )}
    </div>
  );
};

export default BattleCardSplash;
