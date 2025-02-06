import React, { useEffect, useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOM from 'react-dom';

type Props = {
  isOpen: boolean;
  setIsOpen: (f: boolean) => void;
  data: string;
};

function CaseBattleResultModal({ isOpen, setIsOpen, data }: Props) {
  const [players, setPlayers] = useState<number>(0);
  const [parsedData, setParsedData] = useState<number[][]>([]);

  useEffect(() => {
    if (data) {
      const parsed = JSON.parse(data);
      setParsedData(parsed);
      setPlayers(parsed[0].length);
    }
  }, [data]);

  return ReactDOM.createPortal(
    <div
      className={`modal medium active ${
        isOpen ? 'opacity-100 z-[999]' : 'opacity-0 z-[-999]'
      }`}
    >
      <div className='modal-dialog flex justify-center items-center'>
        <div className='modal-content rounded-1'>
          <div className='modal-header flex items-center justify-between'>
            <div className='modal-title text-upper'>Case Battle Results</div>
            <div
              onClick={() => setIsOpen(false)}
              className='modal-close flex justify-center items-center rounded-0'
              data-modal='hide'
            >
              <FontAwesomeIcon icon={faTimes} className='w-[16px]' />
            </div>
          </div>
          <div className='modal-body text-left'>
            <div className='width-full flex justify-center items-center row gap-2'>
              <div
                className='font-6 text-bold'
                style={{ width: 'calc(100% / 3)' }}
              >
                Round
              </div>
              {Array.from({ length: players }, (_, index) => (
                <div
                  key={`player-${index}`}
                  className='font-6 text-bold'
                  style={{ width: `calc(100% / 3)` }}
                >
                  Player {index + 1}
                </div>
              ))}
            </div>
            {parsedData.map((roundData, roundIndex) => (
              <div
                key={`round-${roundIndex}`}
                className='width-full flex justify-center items-center row gap-2'
              >
                <div className='font-6' style={{ width: 'calc(100% / 3)' }}>
                  Round #{roundIndex + 1}
                </div>
                {roundData.map((playerData, playerIndex) => (
                  <div
                    key={`round-${roundIndex}-player-${playerIndex}`}
                    className='font-6'
                    style={{ width: `calc(100% / 3)` }}
                  >
                    {playerData.toFixed(8)}
                  </div>
                ))}
              </div>
            ))}
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

export default CaseBattleResultModal;
