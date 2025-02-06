import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOM from 'react-dom';
import { Coinflip } from '@/lib/client/types';
import { handleCopy } from '@/lib/client/utils';

type Props = {
  isOpen: boolean;
  setIsOpen: (f: boolean) => void;
  fairModalData: Coinflip | undefined;
};

function CoinflipFairModal({ isOpen, setIsOpen, fairModalData }: Props) {
  if (!fairModalData) {
    return null;
  }
  return ReactDOM.createPortal(
    <div
      className={`modal medium active ${
        isOpen ? 'opacity-100 z-[999]' : 'opacity-0 z-[-999]'
      }`}
    >
      <div className='modal-dialog flex justify-center items-center'>
        <div className='modal-content rounded-1'>
          <div className='modal-header flex items-center justify-between'>
            <div className='modal-title text-upper'>Round Results</div>
            <div
              onClick={() => setIsOpen(false)} // Corrected the onClick handler
              className='modal-close flex justify-center items-center rounded-0'
              data-modal='hide'
            >
              <FontAwesomeIcon icon={faTimes} className='w-[16px]' />
            </div>
          </div>
          <div className='modal-body text-left'>
            <div className='flex column gap-4'>
              <div className='flex column gap-2'>
                <div className='font-6 width-full ellipsis'>
                  <span className='text-gray mr-1'>Server Seed (hashed):</span>
                  <span
                    className='pointer'
                    onClick={() =>
                      handleCopy(
                        fairModalData.data.game
                          ? fairModalData.data.game.server_seed_hashed
                          : ''
                      )
                    }
                  >
                    {fairModalData.data.game?.server_seed_hashed}
                  </span>
                </div>
                <div className='font-6 width-full ellipsis'>
                  <span className='text-gray mr-1'>Server Seed:</span>
                  <span
                    className='pointer'
                    onClick={() =>
                      handleCopy(
                        fairModalData.data.game &&
                          fairModalData.data.game?.server_seed
                          ? fairModalData.data.game.server_seed
                          : ''
                      )
                    }
                  >
                    {fairModalData.data.game
                      ? fairModalData.data.game.server_seed
                      : '-'}
                  </span>
                </div>
                <div className='font-6 width-full ellipsis'>
                  <span className='text-gray mr-1'>Public Seed:</span>
                  <span
                    className='pointer'
                    onClick={() =>
                      handleCopy(
                        fairModalData.data.game &&
                          fairModalData.data.game?.public_seed
                          ? fairModalData.data.game.public_seed
                          : ''
                      )
                    }
                  >
                    {fairModalData.data.game
                      ? fairModalData.data.game.public_seed
                      : '-'}
                  </span>
                </div>
                <div className='font-6 width-full ellipsis'>
                  <span className='text-gray mr-1'>Nonce:</span>
                  <span
                    className='pointer'
                    onClick={() =>
                      handleCopy(
                        fairModalData.data.game &&
                          fairModalData.data.game?.nonce
                          ? fairModalData.data.game.nonce
                          : ''
                      )
                    }
                  >
                    {fairModalData.data.game
                      ? fairModalData.data.game.nonce
                      : '-'}
                  </span>
                </div>
                <div className='font-6 width-full ellipsis'>
                  <span className='text-gray mr-1'>EOS block:</span>
                  <a
                    href={
                      'https://eosflare.io/block/' +
                      fairModalData.data.game?.block
                    }
                    target='_black'
                    className='keychainify-checked'
                  >
                    <span>
                      {fairModalData.data.game
                        ? fairModalData.data.game.block
                        : '-'}
                    </span>
                  </a>
                </div>
              </div>
              <div className='column gap-2 hidden'>
                <div className='font-6 width-full ellipsis'>
                  <span className='text-gray mr-1'>Draw Public Seed:</span>
                  <span className='pointer' data-copy='text' data-text=''>
                    -
                  </span>
                </div>
                <div className='font-6 width-full ellipsis'>
                  <span className='text-gray mr-1'>Draw EOS block:</span>
                  <a href='' target='_black' className='keychainify-checked'>
                    <span id='fair_draw_block'>-</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer text-center'>
            <button
              type='button'
              className='site-button purple'
              onClick={() => setIsOpen(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CoinflipFairModal;
