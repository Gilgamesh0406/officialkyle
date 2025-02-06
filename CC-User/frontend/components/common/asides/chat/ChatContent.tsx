import { UserMessageType } from '@/lib/client/types';
import { useEffect, useState } from 'react';

type ChatContentProps = {
  message: UserMessageType;
  isMuted: boolean;
};

const ChatContent = ({ message, isMuted }: ChatContentProps) => {
  const [spoiled, setSpoiled] = useState(isMuted);
  useEffect(() => {
    setSpoiled(isMuted)
  }, [isMuted, message])
  return (
    <div>
      {spoiled ? (
        <div className='blurred-message bg-gray-500 text-white p-1 rounded-lg'>
          <span>This message is hidden</span>
          <button
            onClick={() => setSpoiled(false)}
            className='ml-2 text-sm underline hover:text-blue-500'
          >
            Reveal
          </button>
        </div>
      ) : (
        <div
          className={`chat-message-content bg-light-transparent p-2 rounded-1 ${
            message.type === 'system' ? 'chat-link-system' : ''
          }`}
        >
          {message.message}
        </div>
      )}
    </div>
  );
};

export default ChatContent;
