import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
type Props = {
  open: boolean;
  tradeUrl: string;
  setTradeUrl: (f: string) => void;
  setOpen: (f: boolean) => void;
  onConfirm: () => void;
};

function TradeUrlDlg({ open, tradeUrl, setTradeUrl, setOpen, onConfirm }: Props) {
  return (
    <div
      className={`modal large active ${
        open ? 'opacity-100 z-[999]' : 'opacity-0 z-[-999]'
      }`}
    >
      <div className='modal-dialog flex justify-center items-center'>
        <div className='modal-content rounded-1'>
          <div className='modal-header flex items-center justify-between'>
            <div className='modal-title text-upper'>Enter the Trade Url</div>
            <div
              className='modal-close flex justify-center items-center rounded-0'
              data-modal='hide'
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>

          <div className='modal-body text-left'>
            <div
              className='input_field bet_input_field transition-5'
              data-border='#de4c41'
              style={{
                border: '2px solid var(--site-color-bg-dark)',
                color: 'unset',
              }}
            >
              <div className='field_container'>
                <div className='field_content'>
                  <input
                    type='text'
                    className='field_element_input'
                    data-currency='Trade url'
                    value={tradeUrl}
                    onChange={(e) => setTradeUrl(e.target.value)}
                  />
                </div>

                <div className='field_extra'></div>
              </div>

              <div className='field_bottom'>
                <div className='field_error' data-error='number'>
                  This field must be a number
                </div>
                <div className='field_error' data-error='greater'>
                  You must enter a greater value
                </div>
              </div>
            </div>

            <button
              type='button'
              className='site-button purple mt-2'
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradeUrlDlg;
