import React from 'react';

export default function Loader() {
  return (
    <div className='flex in-grid justify-center items-center width-full height-full history_message'>
      <div className='loader'>
        <div className='loader-part loader-part-1'>
          <div className='loader-dot loader-dot-1'></div>
          <div className='loader-dot loader-dot-2'></div>
        </div>
        <div className='loader-part loader-part-2'>
          <div className='loader-dot loader-dot-1'></div>
          <div className='loader-dot loader-dot-2'></div>
        </div>
      </div>
    </div>
  );
}
