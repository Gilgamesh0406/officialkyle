import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faVolumeMute,
  faVolumeUp,
  faAt,
} from '@fortawesome/free-solid-svg-icons'; // Add the "@" icon
import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import Cookies from 'js-cookie';

type MessageSettingsProps = {
  userId?: string;
  isMuted: boolean;
  onHandleMention: (userid: string) => void;
};

const MessageSettings = ({
  userId,
  isMuted,
  onHandleMention
}: MessageSettingsProps) => {
  const clientSocket = useSocketIoClient();

  const mute = () => {
    if (!userId || !clientSocket) return;

    const muteDuration = 'permanent'; // Default mute duration
    const muteReason = 'Spamming'; // Default mute reason

    // Emit mute message to the server
    clientSocket.emit(
      'message',
      `/mute ${userId} ${muteDuration} ${muteReason}`
    );
    clientSocket.sendRequest({
      type: 'chat',
      command: 'message',
      message: `/mute ${userId} ${muteDuration} ${muteReason}`,
      channel: '',
    });

    console.log(
      `Muted user: ${userId} for ${muteDuration} due to ${muteReason}`
    );
  };

  const unmute = () => {
    const byuserId = Cookies.get('userid');
    if (!byuserId || !userId || !clientSocket) return;

    // Emit unmute message to the server
    clientSocket.emit('message', `/unmute ${userId} ${byuserId}`);
    clientSocket.sendRequest({
      type: 'chat',
      command: 'message',
      message: `/unmute ${userId} ${byuserId}`,
      channel: '',
    });

    console.log(`Unmuted user: ${userId} by ${byuserId}`);
  };

  const mention = () => {
    onHandleMention(userId ? userId : '');
  };

  return (
    <div className='flex space-x-2'>
      {/* Profile Button */}
      <Link href={`/profile/${userId}`}>
        <div className='chat-message-setting' title='Profile'>
          <FontAwesomeIcon icon={faUser} size='lg' />
        </div>
      </Link>

      {/* Mute/Unmute Button */}
      <div
        className='chat-message-setting'
        title={isMuted ? 'Unmute' : 'Mute'}
        onClick={isMuted ? unmute : mute}
      >
        <FontAwesomeIcon icon={isMuted ? faVolumeUp : faVolumeMute} size='lg' />
      </div>

      {/* Mention Button */}
      <div className='chat-message-setting' title='Mention' onClick={mention}>
        <FontAwesomeIcon icon={faAt} size='lg' />
      </div>
    </div>
  );
};

export default MessageSettings;
