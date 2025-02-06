'use client';
import Input from '@/components/ui/Input';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

const WithdrawSteamContent = () => {
  const [searchVal, setsearchVal] = useState('');
  const [priceVal, setpriceVal] = useState('');
  const [activeOrderByVal, setactiveOrderByVal] = useState('Price descending');

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'search') setsearchVal(value);
  };

  const onSelect = (value: string) => {
    setactiveOrderByVal(value);
  };

  return (
    <div className='flex column height-full width-full'>
      <div className='wrapper-page overflow-visible flex row'>
        <div className='flex column overflow-visible height-full width-full content-spliter p-2'>
          <div className='flex justify-between'>
            <Link href='/withdraw'>
              <button className='site-button black flex gap-1'>
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Options
              </button>
            </Link>

            <button className='site-button purple mr-6' id='refresh_inventory'>
              Refresh
            </button>
          </div>

          <div className='flex gap-1'>
            <div
              className='input_field bet_input_field transition-5'
              data-border='#de4c41'
            >
              <Input
                label='Search Item'
                name='deposit-bonus'
                value={searchVal}
                onInput={onInput}
              />
              <div className='field_extra'></div>

              <div className='field_bottom'></div>
            </div>

            <div className='dropdown_field transition-5 overflow-visible'>
              <Input
                label='Order by'
                name='price'
                dropdownData={[
                  {
                    value: 'Price descending',
                  },
                  {
                    value: 'Price acending',
                  },
                  {
                    value: 'Name A-Z',
                  },
                  {
                    value: 'Name Z-A',
                  },
                ]}
                activeVal={activeOrderByVal}
                onSelect={onSelect}
                value={priceVal}
              />
              <div className='field_bottom'></div>
            </div>
          </div>

          <div className='height-full' id='list_items'></div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawSteamContent;
