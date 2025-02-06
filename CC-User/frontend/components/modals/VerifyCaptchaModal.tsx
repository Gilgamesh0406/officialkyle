'use client';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const VerifyCaptchaModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`modal small active ${
        isOpen ? 'opacity-100 z-[999]' : 'opacity-0 z-[-999]'
      }`}
      id='modal_recaptcha'
    >
      <div className='modal-dialog flex justify-center items-center'>
        <div className='modal-content rounded-1'>
          <div className='modal-header flex items-center justify-between'>
            <div className='modal-title text-upper'>Verify Recaptcha</div>
            <div
              onClick={() => setIsOpen(false)} // Corrected the onClick handler
              className='modal-close flex justify-center items-center rounded-0'
              data-modal='hide'
            >
              <FontAwesomeIcon icon={faTimes} className='w-[16px]' />
            </div>
          </div>
          <div className='modal-body font-8'>
            <div className='flex justify-center' id='g-recaptcha'>
              <div id='g-recaptcha-42484'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCaptchaModal;
