import React from 'react';

type Props = {
  name: string;
  price: string | number;
};

function UnboxingGameInfo({ name, price }: Props) {
  return (
    <div className='flex justify-between pr-2 pl-2 font-9 my-3'>
      <div id='unboxing_name'>{name}</div>

      <div className='flex'>
        <div className='coins mr-1'></div>
        <div id='unboxing_price'>{price}</div>
      </div>
    </div>
  );
}

export default UnboxingGameInfo;
