import React from 'react';
import UnboxingCode from './codes/UnboxingCode';
import { PlinkoAndUnboxingFairHistoryType } from '@/lib/client/types';
import UnboxingHistories from './histories/UnboxingHistories';

type Props = {
  handleAccordion: (n: number) => void;
  activeAccordionIndex: number | undefined;
  history: PlinkoAndUnboxingFairHistoryType[];
};

function UnboxingFairness({
  handleAccordion,
  activeAccordionIndex,
  history,
}: Props) {
  return (
    <div
      className={`fair-category transition-2 ${
        activeAccordionIndex === 2 ? 'active' : ''
      }`}
    >
      <div
        className='title font-8 pt-4 pb-4 pr-4 pl-4 pointer'
        onClick={() => handleAccordion(2)}
      >
        Unboxing Game
      </div>

      <div className='description transition-2 overflow-h pr-4 pl-4'>
        <div className='flex column gap-2 pb-4'>
          <div>
            In the{' '}
            <a className='text-color' href='/profile' target='_blank'>
              Provably Fair tab
            </a>
            , you can change the client seed and regenerate the server seed.
          </div>
          <div>
            Server seed is SHA-256 hash generated from random 32 bytes. You can
            regenerate server seed in any time. You cannot see the original
            server seed, yet you will be able to check that it was unmodified
            later after regenerating the server seed.
          </div>
          <div>
            Client seed is generated first time for user, same way like server
            seed. As the client seed affects every roll result, changing it to
            any seed of your choice at any time means you can ensure that it's
            impossible for us to manipulate the result.
          </div>
          <div>
            However, the SHA-256 function we use to generate the roll is
            deterministic, if the client seed is combined with the same server
            seed, it will generate exactly the same roll result every time. This
            could be used to abuse the system, so we use something called a
            'nonce' which prevents this from being abusable. Each roll done
            using the same server seed &amp; client seed pair will also be
            paired with a different nonce, which is simply a number starting at
            0 and incremented by 1 for each roll done.
          </div>
          <div>
            The nonce is based on numbers that we can't manipulate (they
            naturally increment by 1 after each roll).
          </div>

          <div>The total tickets is based on sum of tickets from crates.</div>

          <div>
            SHA-256 returns the hash value for the salt hash combination in a
            hex-encoded form. We then take the first 8 characters from this hash
            and convert this hex string to a number.
          </div>
          <div>
            We apply a modulus of 'total_tickets' to converted number, giving us
            a number in the range of 0-'total_tickets'. Finally, incrementing by
            1 produces a integer number in the range 1-'total_tickets' + 1.
          </div>

          <div>
            Each roll can be verified using this formula as soon as you have
            revealed your server seed for the previous rolls. The published
            unhashed server seeds can be checked by simply applying the SHA-256
            function to it, this will produce the previously published hashed
            version of the server seed, which was made visible to you before any
            roll using it was ever made. Each user can check the integrity of
            every roll made using this information.
          </div>
          <UnboxingCode />
          <div className='table-container'>
            <div className='table-header'>
              <div className='table-row'>
                <div className='table-column text-left'>Id</div>
                <div className='table-column text-left'>Server Seed</div>
                <div className='table-column text-left'>Client Seed</div>
                <div className='table-column text-left'>Nonce</div>
                <div className='table-column text-left'>Tickets</div>
                <div className='table-column text-left'>Roll</div>
              </div>
            </div>
            {history && history.length > 0 ? (
              <UnboxingHistories history={history} />
            ) : (
              <div className='table-body'>
                <div className='table-row'>
                  <div className='table-column text-center'>No data found</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnboxingFairness;
