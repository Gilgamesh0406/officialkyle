import React from 'react';
import Input from '@/components/ui/Input';

type Props = {
  handleAccordion: (n: number) => void;
  activeAccordionIndex: number | undefined;
  onInput: (e: any) => void;
  clientSeedVal: string;
  serverSeedVal: string;
};

function FairnessInfo({
  activeAccordionIndex,
  clientSeedVal,
  handleAccordion,
  onInput,
  serverSeedVal,
}: Props) {
  return (
    <div
      className={`fair-category transition-2 ${
        activeAccordionIndex === 0 ? 'active' : ''
      }`}
    >
      <div
        className='title font-8 pt-4 pb-4 pr-4 pl-4 pointer'
        onClick={() => handleAccordion(0)}
      >
        Info
      </div>

      <div className='description transition-2 overflow-h pr-4 pl-4'>
        <div className='flex column gap-2 pb-4'>
          <div className='flex column'>
            <div className='flex column gap-2 pb-4'>
              <div>
                This is a passphrase or a randomly generated string that is
                determined by the player or their browser. This can be edited
                and changed regularly by yourself.
              </div>

              <div className='input_field transition' data-border='#de4c41'>
                <Input
                  name='clientSeed'
                  label='client seed'
                  onInput={onInput}
                  value={clientSeedVal}
                  extra={
                    <button
                      className='site-button purple top-0'
                      id='save_clientseed'
                    >
                      Save
                    </button>
                  }
                />

                <div className='field_bottom'>
                  <div className='field_error active' data-error='required'>
                    This field is required
                  </div>
                </div>
              </div>
            </div>

            <div className='flex column gap-2 pb-4'>
              <div>
                To reveal the hashed server seed, the seed must be rotated by
                the player, which triggers the replacement with a newly
                generated seed. From this point you are able to verify any bets
                made with the previous server seed to verify both the legitimacy
                of the server seed with the encrypted hash that was provided.
              </div>
              <div>
                You can validate hashed server seed using this script. The
                hashed server seed is a SHA-256 hash of the seed so after you
                unhash it, you can check that it matches with the hashed
                version.
              </div>

              <div className='input_field transition' data-border='#de4c41'>
                <Input
                  name='serverSeed'
                  onInput={onInput}
                  label='Server Seed Hashed'
                  value={serverSeedVal}
                  extra={
                    <button
                      className='site-button purple top-0'
                      id='regenerate_serverseed'
                    >
                      Generate
                    </button>
                  }
                />

                <div className='field_bottom'>
                  <div className='field_error active' data-error='required'>
                    This field is required
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            You can validate hashed server seed using this script. The hashed
            server seed is a SHA-256 hash of the seed so after you unhash it,
            you can check that it matches with the hashed version.
          </div>

          <code className='language-javascript'>
            <div className='line end text-indent-0'>
              <span className='keyword'>var</span>{' '}
              <span className='variable'>sha256</span>{' '}
              <span className='operator'>=</span>{' '}
              <span className='function'>require</span>
              <span className='punctuation'>(</span>
              <span className='string'>'sha256'</span>
              <span className='punctuation'>)</span>
              <span className='punctuation'>;</span>
            </div>
            <div className='line end text-indent-0'>
              <span className='keyword'>var</span>{' '}
              <span className='variable'>seed</span>{' '}
              <span className='operator'>=</span>{' '}
              <span className='string'>
                'f0c82c85ba6ef5cbba7406db81ee5451a1a795120e335116dc637d34a105e6e6'
              </span>
              <span className='punctuation'>;</span>
            </div>
            <div className='line text-indent-0'>
              <span className='keyword'>function</span>{' '}
              <span className='function'>fair_getHash256</span>
              <span className='punctuation'>(</span>
              <span className='variable'>seed</span>
              <span className='punctuation'>)</span>
              <span className='punctuation'>{'{'}</span>
            </div>
            <div className='line text-indent-1'>
              <span className='keyword'>return</span>{' '}
              <span className='variable'>sha256</span>
              <span className='punctuation'>(</span>
              <span className='variable'>seed</span>
              <span className='punctuation'>)</span>
              <span className='punctuation'>;</span>
            </div>
            <div className='line end text-indent-0'>
              <span className='punctuation'>{'}'}</span>
            </div>
            <div className='line text-indent-0'>
              <span className='variable'>console</span>
              <span className='punctuation'>.</span>
              <span className='function'>log</span>
              <span className='punctuation'>(</span>
              <span className='string'>'Hashed: '</span>{' '}
              <span className='operator'>+</span>{' '}
              <span className='function'>fair_getHash256</span>
              <span className='punctuation'>(</span>
              <span className='variable'>seed</span>
              <span className='punctuation'>)</span>
              <span className='punctuation'>)</span>
              <span className='punctuation'>;</span>
            </div>
          </code>

          <div className='table-container'>
            <div className='table-header'>
              <div className='table-row'>
                <div className='table-column text-left'>Id</div>
                <div className='table-column text-left'>Server Seed</div>
                <div className='table-column text-left'>Useds</div>
                <div className='table-column text-left'>Created At</div>
              </div>
            </div>

            <div className='table-body'>
              <div className='table-row'>
                <div className='table-column text-center'>No data found</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FairnessInfo;
