import React from 'react';

type BattleStatsProps = {
  activeCount: number;
  totalCount: number;
  activeImageSrc: string;
  totalImageSrc: string;
};

const BattleStats: React.FC<BattleStatsProps> = ({
  activeCount,
  totalCount,
  activeImageSrc,
  totalImageSrc,
}) => {
  return (
    <div className='flex row gap-4'>
      <div className='flex row gap-2 justify-center items-center'>
        <img width={40} src={activeImageSrc} alt='Active Battles' />

        <div className='flex column items-start gap-1'>
          <div className='font-10 text-bold text-color'>
            <span id='casebattle_stats_active'>{activeCount}</span>
          </div>
          <div className='font-6'>Active</div>
        </div>
      </div>

      <div className='flex row gap-2 justify-center items-center'>
        <img
          height={30}
          className='w-[60px]'
          src={totalImageSrc}
          alt='Total Battles'
        />

        <div className='flex column items-start gap-1'>
          <div className='font-10 text-bold text-color'>
            <span id='casebattle_stats_total'>{totalCount}</span>
          </div>
          <div className='font-6'>Total Battles</div>
        </div>
      </div>
    </div>
  );
};

export default BattleStats;
