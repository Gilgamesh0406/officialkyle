'use client';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { handleCopy } from '@/lib/client/utils';
import CountTo from '@/components/common/CountTo';
import { useSession } from 'next-auth/react';

type Props = {
  onCreateSameBattle: () => void;
  createBattleData: any;
  setModalOpen: (b: boolean) => void;
  cost: number;
};

function CaseBattleCreate({
  onCreateSameBattle,
  createBattleData,
  setModalOpen,
  cost,
}: Props) {
  const pathname = usePathname();
  const params = useParams();
  const session = useSession();
  return (
    <div className='flex row gap-4 overflow-x-auto'>
      {pathname.includes('/casebattle/create') && (
        <div className='flex column justify-between gap-2'>
          <div className='text-color text-bold'>Siphon</div>

          <div className='text-bold font-8'>
            <div className='coins mr-1'></div>
            <span id='casebattle_create_cashback'>
              {(cost / 100).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {pathname.includes('/casebattle/create') && (
        <div className='flex column justify-between gap-2'>
          <div className='text-color text-bold'>TOTAL COST</div>

          <div className='text-bold font-8'>
            <div className='coins mr-1'></div>
            <CountTo
              formatType='balance'
              targetValue={parseFloat(cost.toFixed(2))}
            />
          </div>
        </div>
      )}
      {params.battleid && (
        <>
          <div className='flex row gap-1 text-gray cursor-pointer overflow-x-hidden flex-grow'>
            <FontAwesomeIcon icon={faCopy} width={12} height={12} />
            <span
              className='link min-w-32 w-64'
              onClick={() =>
                handleCopy(process.env.NEXT_PUBLIC_WEB_URL + pathname)
              }
            >
              {process.env.NEXT_PUBLIC_WEB_URL + pathname}
            </span>
          </div>
          <button
            className='site-button green fair-results overflow-x-hidden'
            onClick={() => setModalOpen(true)}
          >
            Probability Fair
          </button>
          {session.status !== 'unauthenticated' && (
            <button
              onClick={onCreateSameBattle}
              className='site-button purple flex overflow-x-hidden'
            >
              Create same battle
              <img style={{ height: 20 }} src='/imgs/coins.webp'></img>
              <span id='casebattle_stats_amount'>
                {createBattleData?.amount.toFixed(2)}
              </span>
            </button>
          )}
        </>
      )}
      {session.status !== 'unauthenticated' && (
        <>
          {pathname.includes('/casebattle/create') ? (
            <button className='site-button purple' onClick={onCreateSameBattle}>
              Create battle
            </button>
          ) : (
            <Link href='/casebattle/create'>
              <button className='site-button purple'>Create battle</button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default CaseBattleCreate;
