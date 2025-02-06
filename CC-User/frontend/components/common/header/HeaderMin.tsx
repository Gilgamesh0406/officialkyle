import { HeaderProps } from '@/lib/client/types';
import Image from 'next/image';
import Link from 'next/link';

const HeaderMin = ({
  filteredRoutes,
  modalIsOpen,
  pathname,
  session,
  setsetSettingsModalIsOpen,
}: HeaderProps) => {
  return (
    <div className='header-min'>
      <div className='header layout flex'>
        <div className='header-logo justify-center'>
          <Link className='flex justify-center items-center' href='/'>
            <Image
              src='/imgs/logo.png?v=1714110404'
              alt='logo'
              width={100}
              height={100}
            />
          </Link>
        </div>

        <div className='flex items-center justify-end gap-2 height-full pr-2'>
          <div className='header-panel bg-light rounded-1 b-l2 flex items-center justify-center'>
            <button
              className='site-button black height-full flex justify-center items-center pt-0 pb-0'
              data-modal='show'
              data-id='#modal_auth'
            >
              LOGIN WITH STEAM
            </button>
          </div>

          <button className='site-button pullout_view' data-pullout='menu'>
            <i className='fa fa-bars' aria-hidden='true'></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMin;
