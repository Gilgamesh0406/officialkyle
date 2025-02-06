import Link from 'next/link';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='grid split-column-full responsive gap-1 mb-2'>
        <Link href='/admin/control'>
          <button className='site-button black active width-full'>
            Control
          </button>
        </Link>
        <Link href='/admin/users'>
          <button className='site-button black width-full'>Users</button>
        </Link>
        <Link href='/admin/trades'>
          <button className='site-button black width-full'>Trades</button>
        </Link>
        <Link href='/admin/casecreator/create/cases'>
          <button className='site-button black width-full'>Case Creator</button>
        </Link>
        <Link href='/admin/gamebots'>
          <button className='site-button black width-full'>Game Bots</button>
        </Link>
      </div>
      {children}
    </>
  );
};

export default layout;
