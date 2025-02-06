import Input from '@/components/ui/Input';
import React from 'react';

type Props = {
  amount: number;
  setAmount: (n: number) => void;
  openCase: () => void;
  openDemo: () => void;
  moving: boolean;
};

function UnboxingGameControl({
  amount,
  openDemo,
  openCase,
  setAmount,
  moving,
}: Props) {
  return (
    <div className='flex row responsive gap-1 mt-2 justify-center items-center'>
      <div className='dropdown_field transition-5'>
        <Input
          label='Amount'
          name='amount'
          value={amount.toString()}
          onSelect={(e) => {
            setAmount(parseInt(e));
          }}
          activeVal={amount.toString()}
          dropdownData={[
            { value: '1' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
            { value: '5' },
          ]}
        />
        <div className='field_bottom'></div>
      </div>

      <div className='flex row gap-1 justify-center items-center'>
        <button
          className={`site-button pink  ${moving && 'disabled'}`}
          id='unboxing_demo'
          onClick={openDemo}
          disabled={moving}
        >
          DEMO
        </button>
        <button
          className={`site-button purple ${moving && 'disabled'}`}
          id='unboxing_open'
          onClick={openCase}
          disabled={moving}
        >
          OPEN CASE
        </button>
      </div>
    </div>
  );
}

export default UnboxingGameControl;
