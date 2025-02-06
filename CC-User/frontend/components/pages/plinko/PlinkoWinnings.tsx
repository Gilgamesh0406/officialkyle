import React from 'react';

type Props = {};

function PlinkoWinnings({}: Props) {
  return (
    <div className='width-full'>
      <div className='plinko-winnings low width-full flex justify-center items-center'>
        <div>x7.1</div>
        <div>x4</div>
        <div>x1.9</div>
        <div>x1.4</div>
        <div>x1.3</div>
        <div>x1.1</div>
        <div>x1</div>
        <div>x0.5</div>
        <div>x1</div>
        <div>x1.1</div>
        <div>x1.3</div>
        <div>x1.4</div>
        <div>x1.9</div>
        <div>x4</div>
        <div>x7.1</div>
      </div>

      <div className='plinko-winnings medium width-full flex justify-center items-center'>
        <div>x58</div>
        <div>x15</div>
        <div>x7</div>
        <div>x4</div>
        <div>x1.9</div>
        <div>x1</div>
        <div>x0.5</div>
        <div>x0.2</div>
        <div>x0.5</div>
        <div>x1</div>
        <div>x1.9</div>
        <div>x4</div>
        <div>x7</div>
        <div>x15</div>
        <div>x58</div>
      </div>

      <div className='plinko-winnings high width-full flex justify-center items-center'>
        <div>x420</div>
        <div>x56</div>
        <div>x18</div>
        <div>x5</div>
        <div>x1.9</div>
        <div>x0.3</div>
        <div>x0.2</div>
        <div>x0.2</div>
        <div>x0.2</div>
        <div>x0.3</div>
        <div>x1.9</div>
        <div>x5</div>
        <div>x18</div>
        <div>x56</div>
        <div>x420</div>
      </div>
    </div>
  );
}

export default PlinkoWinnings;
