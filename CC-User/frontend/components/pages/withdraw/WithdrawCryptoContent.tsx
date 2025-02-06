'use client';
import Input from '@/components/ui/Input';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

const WithdrawCryptoContent = () => {
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
    <div className='flex column height-full width-full p-2'>
      <div className='flex justify-start'>
        <Link href='/withdraw'>
          <button className='site-button black flex gap-1 items-center'>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Options
          </button>
        </Link>
      </div>

      <div className='flex column items-center gap-2 mt-4 overflow-a'>
        <div className='width-6 responsive text-left'>
          <div className='font-10 text-bold mb-2'>Withdraw with Litecoin</div>

          <div className='font-6 text-gray'>
            All Litecoin withdrawals are sent instantly.
          </div>
        </div>

        <div className='bg-light-transparent text-left rounded-1 b-d2 p-4 width-6 responsive currency-panel'>
          <div className='font-8 text-bold mb-2'>Litecoin wallet address</div>

          <div className='font-6 text-gray'>
            Please enter the Litecoin wallet address you want the withdrawal to
            be sent to.
          </div>
          <div className='font-6 text-gray'>
            All withdraws more than 0.01 coins, require manually confirmations
            and checks.
          </div>

          <div
            className='input_field bet_input_field transition-5 mt-4'
            data-border='#de4c41'
          >
            <div className='field_container'>
              <div className='field_content'>
                <input
                  type='text'
                  className='field_element_input'
                  id='currency_withdraw_address'
                  value=''
                />

                <div className='field_label transition-5 active'>
                  Your personal LTC withdraw address
                </div>
              </div>

              <div className='field_extra'></div>
            </div>

            <div className='field_bottom'>
              <div className='field_error active' data-error='required'>
                This field is required
              </div>
            </div>
          </div>

          <div className='flex responsive mt-4'>
            <div
              className='input_field bet_input_field transition-5'
              data-border='#de4c41'
            >
              <div className='field_container'>
                <div className='field_content'>
                  <input
                    type='text'
                    className='field_element_input'
                    id='currency_coin_from'
                    data-currency='ltc'
                    value='100'
                  />

                  <div className='field_label transition-5 active'>
                    <div className='input_coins coins mr-1'></div>Amount Coins
                  </div>
                </div>

                <div className='field_extra'></div>
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

            <div className='flex justify-center items-center pr-2 pl-2 font-10'>
              =
            </div>

            <div
              className='input_field bet_input_field transition-5'
              data-border='#de4c41'
            >
              <div className='field_container'>
                <div className='field_content'>
                  <input
                    type='text'
                    className='field_element_input'
                    id='currency_coin_to'
                    data-currency='ltc'
                    value=''
                  />

                  <div className='field_label transition-5 active'>
                    <div className='input_coins ltc-coins mr-1'></div>Amount
                    Litecoin
                  </div>
                </div>

                <div className='field_extra'></div>
              </div>

              <div className='field_bottom'>
                <div className='field_error' data-error='number'>
                  This field must be a number
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-center mt-2'>
            <button
              type='button'
              className='site-button purple'
              id='crypto_withdraw'
              data-currency='ltc'
            >
              WITHDRAW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawCryptoContent;
