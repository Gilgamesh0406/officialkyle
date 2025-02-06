import React from 'react';
import { usePathname } from 'next/navigation';
import { casebattle_navs } from '@/lib/client/navigation';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CaseBattleNav() {
  const pathname = usePathname();
  return (
    <div
      className={`relative z-10 flex responsive gap-2 bb-l2 pb-2 ${pathname.includes('/casebattle/list') ? 'justify-end' : 'justify-between'}`}
    >
      {!pathname.includes('/casebattle/list') && (
        <a href='/casebattle/list/active' className=''>
          <button className='site-button black active flex'>
            <FontAwesomeIcon
              icon={faArrowLeft}
              width={15}
              height={15}
              className='my-auto ml-0'
            />{' '}
            Back to battles
          </button>
        </a>
      )}
      <div className='flex row gap-3 mr-6'>
        {casebattle_navs.map((item, index) => (
          <a href={item.to} key={index}>
            <button
              className={`site-button black ${item.to === pathname ? 'active' : ''}`}
            >
              {item.text}
            </button>
          </a>
        ))}
      </div>
    </div>
  );
}
