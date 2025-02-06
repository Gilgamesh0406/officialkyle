import React from 'react';

interface BetInputFieldProps {
  inputVal: string;
  setInputVal: (value: string) => void;
  onClear: () => void;
  onAdd: (amount: number) => void;
  onDivide: (factor: number) => void;
  onMultiply: (factor: number) => void;
  onMax: () => void;
}

const BetInputField: React.FC<BetInputFieldProps> = ({
  inputVal,
  setInputVal,
  onClear,
  onAdd,
  onDivide,
  onMultiply,
  onMax,
}) => {
  return (
    <div
      className='input_field bet_input_field transition-5'
      data-border='#de4c41'
    >
      <div className='field_container'>
        <div className='field_content'>
          <input
            onChange={(e) => setInputVal(e.target.value)}
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
            data-game='coinflip'
            onClick={onClear}
            data-action='clear'
          >
            Clear
          </button>
          <button
            className='site-button betshort_action'
            data-game='coinflip'
            onClick={() => onAdd(1)}
            data-action='1.00'
          >
            +1.00
          </button>
          <button
            className='site-button betshort_action'
            data-game='coinflip'
            onClick={() => onAdd(10)}
            data-action='10.00'
          >
            +10.00
          </button>
          <button
            className='site-button betshort_action'
            data-game='coinflip'
            onClick={() => onAdd(100)}
            data-action='100.00'
          >
            +100.00
          </button>
          <button
            className='site-button betshort_action'
            data-game='coinflip'
            onClick={() => onDivide(2)}
            data-action='half'
          >
            1/2
          </button>
          <button
            className='site-button betshort_action'
            data-game='coinflip'
            onClick={() => onMultiply(2)}
            data-action='double'
          >
            x2
          </button>
          <button
            className='site-button betshort_action'
            data-game='coinflip'
            onClick={onMax}
            data-action='max'
          >
            Max
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
};

export default BetInputField;
