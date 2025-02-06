import React from 'react';

type Props = {
  inputVal: string;
  setInputVal: (s: string) => void;
  add: (n: number) => void;
  clear: () => void;
  max: () => void;
  divide: (n: number) => void;
  multiply: (n: number) => void;
};

function PlinkoBetInput({ add, inputVal, setInputVal }: Props) {
  return (
    <div
      className='input_field bet_input_field transition-5'
      data-border='#de4c41'
    >
      <div className='field_container'>
        <div className='field_content'>
          <input
            onInput={(e: any) => setInputVal(e.target.value)}
            type='text'
            className='betamount field_element_input'
            id='betamount_coinflip'
            data-game='coinflip'
            data-amount='coinflip'
            value={inputVal}
          />

          <div className='field_label transition-5 active'>
            <div className='input_coins coins mr-1'></div>Bet Amount
          </div>
        </div>

        <div className='field_extra'>
          <button
            className='site-button betshort_action'
            onClick={() => add(0.1)}
            data-game='plinko'
            data-action='0.10'
          >
            +0.10
          </button>
          <button
            className='site-button betshort_action'
            onClick={() => add(1)}
            data-game='plinko'
            data-action='1.00'
          >
            +1.00
          </button>
          <button
            className='site-button betshort_action'
            onClick={() => add(10)}
            data-game='plinko'
            data-action='10.00'
          >
            +10.00
          </button>
        </div>
      </div>

      <div className='field_bottom'>
        <div className='field_error' data-error='required'>
          This field is required
        </div>
        <div className='field_error' data-error='number'>
          This field must be a number
        </div>
        <div className='field_error' data-error='greater'>
          You must enter a greater value
        </div>
        <div className='field_error active' data-error='lesser'>
          You must enter a lesser value
        </div>
      </div>
    </div>
  );
}

export default PlinkoBetInput;
