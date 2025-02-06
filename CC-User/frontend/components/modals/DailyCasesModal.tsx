import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DailyCaseType } from '@/lib/client/types';
import DailyCaseItem from './DailyCaseItem';
type Props = {
  open: boolean;
  setOpen: (f: boolean) => void;
  dailyCases: DailyCaseType[];
};

function DailyCasesModal({ open, setOpen, dailyCases }: Props) {
  return (
    <div
      className={`modal large active ${
        open ? 'opacity-100 z-[999]' : 'opacity-0 z-[-999]'
      }`}
    >
      <div className='modal-dialog flex justify-center items-center'>
        <div className='modal-content rounded-1'>
          <div className='modal-header flex items-center justify-between'>
            <div className='modal-title text-upper'>Daily Cases</div>
            <div
              className='modal-close flex justify-center items-center rounded-0'
              data-modal='hide'
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
          <div className='modal-body text-left'>
            <div id='dailycases_cases'>
              {dailyCases.length > 0
                ? dailyCases.map((dc) => (
                    <DailyCaseItem key={dc.id} dailyCase={dc} level={1} />
                  ))
                : 'No daily cases found'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyCasesModal;
