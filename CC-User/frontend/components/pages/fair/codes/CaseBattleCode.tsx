import React from 'react';

export default function CaseBattleCode() {
  return (
    <code className='language-javascript'>
      <div className='line end text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>crypto</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='function'>require</span>
        <span className='punctuation'>(</span>
        <span className='string'>'crypto'</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_server_seed</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='string'>
          '48dc637aedd2d53c1dbf4d0cb8c48e3be1a243a6fb9e6738cd528cef1db1159e'
        </span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_public_seed</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='string'>
          '11db6dc55673ab3d610ee1b96593a08ed5029231f4a0fa1e8d54e1b4abd34c5f'
        </span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_nonce</span>{' '}
        <span className='operator'>=</span> <span className='number'>3</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_rounds</span>{' '}
        <span className='operator'>=</span> <span className='number'>4</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_players</span>{' '}
        <span className='operator'>=</span> <span className='number'>2</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>function</span>{' '}
        <span className='function'>fair_getCombinedSeed</span>
        <span className='punctuation'>(</span>
        <span className='variable'>server_seed</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>public_seed</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>nonce</span>
        <span className='punctuation'>)</span>{' '}
        <span className='punctuation'>{'{'}</span>
      </div>
      <div className='line text-indent-1'>
        <span className='keyword'>return</span>{' '}
        <span className='punctuation'>[</span>
        <span className='variable'>server_seed</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>public_seed</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>nonce</span>
        <span className='punctuation'>]</span>
        <span className='punctuation'>.</span>
        <span className='function'>join</span>
        <span className='punctuation'>(</span>
        <span className='string'>'-'</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-0'>
        <span className='punctuation'>{'}'}</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>function</span>{' '}
        <span className='function'>fair_generateSaltHash</span>
        <span className='punctuation'>(</span>
        <span className='variable'>seed</span>
        <span className='punctuation'>)</span>{' '}
        <span className='punctuation'>{'{'}</span>
      </div>
      <div className='line text-indent-1'>
        <span className='keyword'>return</span>{' '}
        <span className='variable'>crypto</span>
        <span className='punctuation'>.</span>
        <span className='function'>createHmac</span>
        <span className='punctuation'>(</span>
        <span className='string'>'sha256'</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>seed</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>.</span>
        <span className='function'>digest</span>
        <span className='punctuation'>(</span>
        <span className='string'>'hex'</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-0'>
        <span className='punctuation'>{'}'}</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>function</span>{' '}
        <span className='function'>fair_getRoll</span>
        <span className='punctuation'>(</span>
        <span className='variable'>salt</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>max</span>
        <span className='punctuation'>)</span>{' '}
        <span className='punctuation'>{'{'}</span>
      </div>
      <div className='line text-indent-1'>
        <span className='keyword'>return</span>{' '}
        <span className='variable'>Math</span>
        <span className='punctuation'>.</span>
        <span className='function'>abs</span>
        <span className='punctuation'>(</span>
        <span className='function'>parseInt</span>
        <span className='punctuation'>(</span>
        <span className='variable'>salt</span>
        <span className='punctuation'>.</span>
        <span className='function'>substr</span>
        <span className='punctuation'>(</span>
        <span className='number'>0</span>
        <span className='punctuation'>,</span>{' '}
        <span className='number'>12</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>,</span>{' '}
        <span className='number'>16</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>)</span>{' '}
        <span className='operator'>%</span>{' '}
        <span className='variable'>max</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-0'>
        <span className='punctuation'>{'}'}</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>function</span>{' '}
        <span className='function'>fair_getRollCaseBattle</span>
        <span className='punctuation'>(</span>
        <span className='variable'>salt</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>rounds</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>players</span>
        <span className='punctuation'>)</span>{' '}
        <span className='punctuation'>{'{'}</span>
      </div>
      <div className='line end text-indent-1'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>array</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='punctuation'>[</span>
        <span className='punctuation'>]</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-1'>
        <span className='function'>for</span>
        <span className='punctuation'>(</span>
        <span className='keyword'>var</span> <span className='variable'>i</span>{' '}
        <span className='operator'>=</span> <span className='number'>0</span>
        <span className='punctuation'>;</span>{' '}
        <span className='variable'>i</span>{' '}
        <span className='operator'>&lt;</span>{' '}
        <span className='variable'>rounds</span>
        <span className='punctuation'>;</span>{' '}
        <span className='variable'>i</span>
        <span className='operator'>++</span>
        <span className='punctuation'>)</span>{' '}
        <span className='punctuation'>{'{'}</span>
      </div>
      <div className='line end text-indent-2'>
        <span className='variable'>array</span>
        <span className='punctuation'>.</span>
        <span className='function'>push</span>
        <span className='punctuation'>(</span>
        <span className='punctuation'>[</span>
        <span className='punctuation'>]</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-2'>
        <span className='function'>for</span>
        <span className='punctuation'>(</span>
        <span className='keyword'>var</span> <span className='variable'>j</span>{' '}
        <span className='operator'>=</span> <span className='number'>0</span>
        <span className='punctuation'>;</span>{' '}
        <span className='variable'>j</span>{' '}
        <span className='operator'>&lt;</span>{' '}
        <span className='variable'>players</span>
        <span className='punctuation'>;</span>{' '}
        <span className='variable'>j</span>
        <span className='operator'>++</span>
        <span className='punctuation'>)</span>{' '}
        <span className='punctuation'>{'{'}</span>
      </div>
      <div className='line text-indent-3'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>salt_position</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='function'>fair_generateSaltHash</span>
        <span className='punctuation'>(</span>
        <span className='variable'>salt</span>{' '}
        <span className='operator'>+</span> <span className='string'>'-'</span>{' '}
        <span className='operator'>+</span> <span className='variable'>i</span>{' '}
        <span className='operator'>+</span> <span className='string'>'-'</span>{' '}
        <span className='operator'>+</span> <span className='variable'>j</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-3'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='function'>fair_getRoll</span>
        <span className='punctuation'>(</span>
        <span className='variable'>salt_position</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>Math</span>
        <span className='punctuation'>.</span>
        <span className='function'>pow</span>
        <span className='punctuation'>(</span>
        <span className='number'>10</span>
        <span className='punctuation'>,</span> <span className='number'>8</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>)</span>{' '}
        <span className='operator'>/</span>{' '}
        <span className='variable'>Math</span>
        <span className='punctuation'>.</span>
        <span className='function'>pow</span>
        <span className='punctuation'>(</span>
        <span className='number'>10</span>
        <span className='punctuation'>,</span> <span className='number'>8</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-3'>
        <span className='variable'>array</span>
        <span className='punctuation'>[</span>
        <span className='variable'>i</span>
        <span className='punctuation'>]</span>
        <span className='punctuation'>.</span>
        <span className='function'>push</span>
        <span className='punctuation'>(</span>
        <span className='variable'>roll</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-2'>
        <span className='punctuation'>{'}'}</span>
      </div>
      <div className='line end text-indent-1'>
        <span className='punctuation'>{'}'}</span>
      </div>
      <div className='line text-indent-1'>
        <span className='keyword'>return</span>{' '}
        <span className='variable'>array</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='punctuation'>{'}'}</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>generated_seed</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='function'>fair_getCombinedSeed</span>
        <span className='punctuation'>(</span>
        <span className='variable'>roll_server_seed</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>roll_public_seed</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>roll_nonce</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>generated_salt</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='function'>fair_generateSaltHash</span>
        <span className='punctuation'>(</span>
        <span className='variable'>generated_seed</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>generated_roll</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='function'>fair_getRollCaseBattle</span>
        <span className='punctuation'>(</span>
        <span className='variable'>generated_salt</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>roll_rounds</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>roll_players</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='variable'>console</span>
        <span className='punctuation'>.</span>
        <span className='function'>log</span>
        <span className='punctuation'>(</span>'Roll
        <span className='punctuation'>:</span> '{' '}
        <span className='operator'>+</span>{' '}
        <span className='variable'>JSON</span>
        <span className='punctuation'>.</span>
        <span className='function'>stringify</span>
        <span className='punctuation'>(</span>
        <span className='variable'>generated_roll</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
    </code>
  );
}
