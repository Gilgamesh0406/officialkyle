'use client';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

const Cart = ({
  onCartOpen,
  cartOpen,
}: {
  onCartOpen: (val: boolean) => void;
  cartOpen: boolean;
}) => {
  const handleCart = () => {
    onCartOpen(true);
  };
  return (
    <>
      <div
        onClick={handleCart}
        className='slider slider-right text-right slider-top flex justify-content transition-5 p-2 pullout_view'
        data-pullout='cart'
      >
        <FontAwesomeIcon icon={faShoppingCart} className='w-[16px]' />
      </div>
      <div
        className='pullout pullout-right flex column transition-5 active'
        data-pullout='cart'
        style={{ right: cartOpen ? '0px' : '-275px', width: '275px' }}
      >
        <div className='m-2'>
          <div className='flex justify-between items-center mb-2 font-7'>
            <div
              onClick={() => onCartOpen(false)}
              className='pullout_view pointer'
              data-pullout='cart'
            >
              <FontAwesomeIcon icon={faTimes} className='w-[16px]' />
            </div>
          </div>

          <button
            className='site-button black relative switch_panel width-full active'
            data-id='offers'
            data-panel='pending'
            style={{ top: '0px' }}
          >
            PENDING
            <div
              className='sop-medium-right bg-danger rounded-full flex justify-center items-center hidden'
              id='pending_count'
            >
              0
            </div>
          </button>
        </div>

        <div className='wrapper-page flex column height-full width-full'>
          <div
            className='wrapper-page switch_content flex column pr-1 pl-1 hidden'
            data-id='offers'
            data-panel='cart'
          >
            <div className='flex column gap-1'>
              <button
                className='confirm-offer site-button purple width-full'
                data-confirm='order'
              >
                Confirm
              </button>
            </div>

            <div className='header-items justify-between flex items-center'>
              <div className='text-left'>
                Skins: <span id='cart_items_count'>0</span>
              </div>
              <div className='flex'>
                <img className='h-[25px]' src='/imgs/coins.webp' />
                <span id='cart_items_total'>0.00</span>
              </div>
            </div>

            <div
              className='flex gap-1 column width-full p-1 pt-2 pb-2 overflow-a'
              id='cart-items'
            ></div>
          </div>

          <div
            className='wrapper-page switch_content flex column pr-1 pl-1'
            data-id='offers'
            data-panel='pending'
          >
            <div className='header-items flex justify-between'>
              <div className='text-left'>
                Skins: <span id='padding_items_count'>0</span>
              </div>
              <div className='text-right flex'>
                <img className='h-[25px]' src='/imgs/coins.webp' />{' '}
                <span id='padding_items_total'>0.00</span>
              </div>
            </div>

            <div
              className='grid gap-2 width-full p-1 pt-2 pb-2 overflow-a'
              id='pending-offers'
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
