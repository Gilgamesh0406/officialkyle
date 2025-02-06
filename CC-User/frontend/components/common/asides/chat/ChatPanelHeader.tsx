import React from 'react';
import { faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  onChatOpen: (b: boolean) => void;
  online: number;
};

function ChatPanelHeader({ onChatOpen, online }: Props) {
  return (
    <div className='flex justify-between items-center mb-2 font-7'>
      <div>
        <FontAwesomeIcon icon={faUser} className='w-[16px]' />
        <span id='isonline'>{online}</span> Online
      </div>

      <div
        onClick={() => onChatOpen(false)}
        className='pullout_view pointer'
        data-pullout='chat'
      >
        <FontAwesomeIcon icon={faTimes} className='w-[16px]' />
      </div>
    </div>
  );
}

export default ChatPanelHeader;
