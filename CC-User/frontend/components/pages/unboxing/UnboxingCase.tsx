import { UnboxingCaseType } from '@/lib/client/types';
import { getFormatAmountString } from '@/lib/client/utils';
import React from 'react';

type Props = {
  unboxing: UnboxingCaseType;
};

function UnboxingCase({ unboxing }: Props) {
  return (
    <a href={`/unboxing/${unboxing.id}`}>
      <div className='case-item flex column gap-1'>
        <div className='case-slot rounded-0'>
          <div className='case-image-content flex items-center justify-center p-2'>
            <img
              className='case-image transition-5'
              src={unboxing.image}
              alt={unboxing.name}
            />
          </div>
          <div className='case-name-content text-left ellipsis'>
            {unboxing.name}
          </div>
          <div className='case-price text-left'>
            <div className='coins mr-1'></div>
            {getFormatAmountString(unboxing.price)}
          </div>
        </div>
      </div>
    </a>
  );
}

export default UnboxingCase;
