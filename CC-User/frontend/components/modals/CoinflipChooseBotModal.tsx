'use client';
import React from 'react';
import ReactDOM from 'react-dom';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BotType } from '@/lib/client/types';
import GameBot from '../common/GameBot';
type Props = {
  isOpen: boolean;
  setIsOpen: (f: boolean) => void;
  bots: BotType[] | undefined;
  currentBotIndex: number;
  setCurrentBotIndex: (i: number) => void;
  playWithBot: (userid: string) => void;
};

function CoinflipChooseBotModal({
  isOpen,
  setIsOpen,
  bots,
  currentBotIndex,
  setCurrentBotIndex,
  playWithBot,
}: Props) {
  if (!bots) {
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
            <div className='modal-title text-upper'>Choose a bot</div>
            <div
              onClick={() => setIsOpen(false)} // Corrected the onClick handler
              className='modal-close flex justify-center items-center rounded-0'
              data-modal='hide'
            >
              <FontAwesomeIcon icon={faTimes} className='w-[16px]' />
            </div>
          </div>
          <div className='modal-body text-left'>
            <div className='flex column gap-2 height-full overflow-h'>
              <div id='gamebots_list'>
                {bots.length > 0 ? (
                  <>
                    {bots.map((bot, idx) => (
                      <GameBot
                        bot={bot}
                        key={idx}
                        selected={idx === currentBotIndex}
                        selectBot={() => setCurrentBotIndex(idx)}
                      />
                    ))}
                  </>
                ) : (
                  <div className='in-grid flex justify-center items-center font-8 p-4 history_message'>
                    No active bots found
                  </div>
                )}
              </div>

              <button
                className='site-button purple'
                id='gamebots_confirm'
                data-game=''
                data-data=''
                onClick={() => playWithBot(bots[currentBotIndex].user.userid)}
              >
                Play with this Bot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CoinflipChooseBotModal;
