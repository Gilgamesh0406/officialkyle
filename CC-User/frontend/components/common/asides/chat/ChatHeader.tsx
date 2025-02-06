import { getRankName } from '@/lib/client/utils';
import { UserMessageType } from '@/lib/client/types';

type ChatHeaderProps = {
  message: UserMessageType;
};

const ChatHeader = ({ message }: ChatHeaderProps) => {
  return (
    <div className='chat-message-header flex column justify-center'>
      <div
        className={`chat-message-name ${
          message.type === 'system' ? 'chat-link-system' : ''
        } ellipsis`}
      >
        {message.type === 'player' ? message.user?.name : message.type}
      </div>
      <div className='chat-message-time'>{getRankName(message.user?.rank)}</div>
    </div>
  );
};

export default ChatHeader;
