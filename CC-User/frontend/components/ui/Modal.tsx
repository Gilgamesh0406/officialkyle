import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
      <div className='bg-dark rounded-lg max-w-md w-full'>
        <div className='flex justify-between items-center p-4 border-b border-gray-700'>
          <h2 className='text-lg font-bold'>{title}</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-white'>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
