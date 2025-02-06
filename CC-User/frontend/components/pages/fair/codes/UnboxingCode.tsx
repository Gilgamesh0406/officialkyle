import React from 'react';

export default function UnboxingCode() {
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
          '2c3eea4603280f3cadfb0046b248e7b756930b0b6886997ac73f96d478c823f3'
        </span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_client_seed</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='string'>'0b3eeb63c10796f00e3faff36207b369'</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_nonce</span>{' '}
        <span className='operator'>=</span> <span className='number'>12</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_total_tickets</span>{' '}
        <span className='operator'>=</span> <span className='number'>100</span>
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
        <span className='keyword'>var</span>{' '}
        <span className='variable'>generated_seed</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='function'>fair_getCombinedSeed</span>
        <span className='punctuation'>(</span>
        <span className='variable'>roll_server_seed</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>roll_client_seed</span>
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
        <span className='function'>fair_getRoll</span>
        <span className='punctuation'>(</span>
        <span className='variable'>generated_salt</span>
        <span className='punctuation'>,</span>{' '}
        <span className='variable'>roll_total_tickets</span>
        <span className='punctuation'>)</span>{' '}
        <span className='operator'>+</span> <span className='number'>1</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='variable'>console</span>
        <span className='punctuation'>.</span>
        <span className='function'>log</span>
        <span className='punctuation'>(</span>
        <span className='string'>'Roll: '</span>{' '}
        <span className='operator'>+</span>{' '}
        <span className='variable'>generated_roll</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
    </code>
  );
}
