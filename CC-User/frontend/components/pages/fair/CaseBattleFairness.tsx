import React from 'react';
import CaseBattleCode from './codes/CaseBattleCode';
import CaseBattleHistories from './histories/CaseBattleHistories';

type Props = {
  handleAccordion: (n: number) => void;
  activeAccordionIndex: number | undefined;
  history: any[];
};

function CaseBattleFairness({
  handleAccordion,
  activeAccordionIndex,
  history,
}: Props) {
  return (
    <div
      className={`fair-category transition-2 ${
        activeAccordionIndex === 3 ? 'active' : ''
      }`}
    >
      <div
        className='title font-8 pt-4 pb-4 pr-4 pl-4 pointer'
        onClick={() => handleAccordion(3)}
      >
        Case Battle Game
      </div>

      <div className='description transition-2 overflow-h pr-4 pl-4'>
        <div className='flex column gap-2 pb-4'>
          <div>
            Case Battle uses a provably fair system in which the public seed is
            not known until after a battle game has started. The result for each
            battle is generated using the SHA-256 hash of 3 separate inputs:
          </div>
          <div>
            The server seed is a securely random value, generated when a round
            is created. The SHA-256 hash of the server seed is displayed to all
            players immediately after a round is created. Players can check that
            the private seed revealed after the case battle result is made known
            matches this SHA-256 hash.
          </div>
          <div>
            The public seed is the ID of an{' '}
            <a
              className='text-color'
              href='https://eosflare.io/'
              target='_black'
            >
              EOS block
            </a>
            , which is to be generated after the countdown is finished. When the
            countdown is finished, our system chooses a block number on the EOS
            blockchain that will be generated in the near future. The ID of this
            block is what will be used as the public seed. This way, neither the
            players nor our system know what data will be used to generate the
            case battle result until after both players have committed their
            bets.
          </div>
          <div>The nonce is based on numbers that is the round id.</div>

          <div>
            The rounds is based on numbers that is the number of cases the
            battle have.
          </div>
          <div>
            The players is based on numbers that is the number of players the
            battle have.
          </div>
          <div>
            The output is a matrix. Each row represents the round and the column
            represents the player position. Each value is based on numbers that
            is the case roll.
          </div>
          <CaseBattleCode />
          <div className='table-container'>
            <div className='table-header'>
              <div className='table-row'>
                <div className='table-column text-left'>Id</div>
                <div className='table-column text-left'>Server Seed</div>
                <div className='table-column text-left'>Public Seed</div>
                <div className='table-column text-left'>Block id</div>
                <div className='table-column text-left'>Roll</div>
                <div className='table-column text-left'>Created At</div>
              </div>
            </div>
            {history && history.length > 0 ? (
              <CaseBattleHistories records={history} />
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

export default CaseBattleFairness;
