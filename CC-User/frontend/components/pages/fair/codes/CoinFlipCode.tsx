import React from 'react';

export default function CoinFlipCode() {
  return (
    <code className='language-javascript'>
      <div className='line text-indent-0'>
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
          '30dfbd2887ff70583787976bc3105fc992942f91985c7acd96cc5a2ff4de6e45'
        </span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_public_seed</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='string'>
          '0d3a2d2c14fa35d5cec6c3940b05040e62ba57182661174dc48a35e6dab46e7d'
        </span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line end text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>roll_nonce</span>{' '}
        <span className='operator'>=</span> <span className='number'>1</span>
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
        <span className='function'>max</span>
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
        <span className='function'>max</span>
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
        <span className='function'>fair_getRoll</span>
        <span className='punctuation'>(</span>
        <span className='variable'>generated_salt</span>
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
      <div className='line end text-indent-0'>
        <span className='keyword'>var</span>{' '}
        <span className='variable'>generated_side</span>{' '}
        <span className='operator'>=</span>{' '}
        <span className='punctuation'>(</span>
        <span className='variable'>generated_roll</span>{' '}
        <span className='operator'>&lt;</span> <span className='number'>0</span>
        <span className='punctuation'>.</span>
        <span className='number'>5</span>
        <span className='punctuation'>)</span>{' '}
        <span className='punctuation'>?</span> <span className='number'>1</span>{' '}
        <span className='punctuation'>:</span> <span className='number'>2</span>
        <span className='punctuation'>;</span>
      </div>
      <div className='line text-indent-0'>
        <span className='variable'>console</span>
        <span className='punctuation'>.</span>
        <span className='function'>log</span>
        <span className='punctuation'>(</span>
        <span className='string'>'Roll: '</span>{' '}
        <span className='operator'>+</span>{' '}
        <span className='variable'>generated_roll</span>{' '}
        <span className='operator'>+</span>{' '}
        <span className='string'>' | Side: '</span>{' '}
        <span className='operator'>+</span>{' '}
        <span className='variable'>generated_side</span>
        <span className='punctuation'>)</span>
        <span className='punctuation'>;</span>
      </div>
    </code>
  );
}
