import { useEffect, useRef, useState } from 'react';
import { UserMessageType } from '@/lib/client/types';
import ChatMessage from './ChatMessage';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import Cookies from 'js-cookie';
import Modal from '@/components/ui/Modal';
import { Input } from 'postcss';

type PropsComponent = {
  messages: UserMessageType[];
  userId: string | undefined;
  isSocketConnected: boolean;
  currentChannel: string;
  onHandleMention: (userid: string) => void;
  rank: number;
};

const ChatMessages = ({
  messages,
  userId,
  isSocketConnected,
  currentChannel,
  rank,
  onHandleMention,
}: PropsComponent) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const clientSocket = useSocketIoClient();
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<string>('');
  const [banDuration, setBanDuration] = useState<string>('');

  const fetchMutedUsers = async () => {
    try {
      const response = await fetch('/api/muted-users');
      if (!response.ok) {
        throw new Error(`Failed to fetch muted users: ${response.statusText}`);
      }

      const data = await response.json();
      setMutedUsers(data);
    } catch (err: any) {
    } finally {
    }
  };
  const fetchBannedUsers = async () => {
    const response = await fetch('/api/banned-users');
    const data = await response.json();
    setBannedUsers(data);
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    fetchMutedUsers();
    fetchBannedUsers();
  }, [messages, currentChannel]);

  const banUser = (userid: string) => {
    setIsBanModalOpen(true);
    setUserToBan(userid);
  };

  const handleBanDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBanDuration(e.target.value);
  };

  const handleBanUser = () => {
    if (!userToBan || !banDuration || !clientSocket) return;
    const reason = 'Spamming';
    clientSocket.emit('message', `/ban ${userToBan} ${banDuration} ${reason}`);
    clientSocket.sendRequest({
      type: 'chat',
      command: 'message',
      message: `/ban ${userToBan} ${banDuration} ${reason}`,
      channel: '',
    });
  };

  const unbanUser = (userid: string) => {
    if (!userid || !clientSocket) return;
    const byuserId = Cookies.get('userid');
    clientSocket.emit('message', `/unban ${userid} ${byuserId}`);
    clientSocket.sendRequest({
      type: 'chat',
      command: 'message',
      message: `/unban ${userid} ${byuserId}`,
      channel: '',
    });
  };

  const muteUser = (userid: string) => {
    if (!userid || !clientSocket) return;
    const muteDuration = 'permanent';
    const muteReason = 'Spamming';
    clientSocket.emit(
      'message',
      `/mute ${userid} ${muteDuration} ${muteReason}`
    );

    clientSocket.sendRequest({
      type: 'chat',
      command: 'message',
      message: `/mute ${userid} ${muteDuration} ${muteReason}`,
      channel: '',
    });
  };

  const unmuteUser = (userid: string) => {
    if (!userid || !clientSocket) return;
    const byuserId = Cookies.get('userid');
    clientSocket.emit('message', `/unmute ${userid} ${byuserId}`);
    clientSocket.sendRequest({
      type: 'chat',
      command: 'message',
      message: `/unmute ${userid} ${byuserId}`,
      channel: '',
    });
  };

  const deleteMessage = (id: number) => {
    if (!id || !clientSocket) return;
    clientSocket.emit('message', `/deletemessage ${id}`);
    clientSocket.sendRequest({
      type: 'chat',
      command: 'message',
      message: `/deletemessage ${id}`,
      channel: '',
    });
  };

  return (
    <div
      className={`w-full max-w-5xl h-full bg-base-300 rounded-xl p-2 shadow-2xl ${
        isSocketConnected ? 'shadow-green-950' : 'shadow-amber-950'
      } overflow-auto scroll`}
    >
      {messages
        .filter((message) => message.channel === currentChannel)
        .map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            userId={userId}
            mutedUsers={mutedUsers}
            rank={rank}
            onHandleMention={onHandleMention}
            bannedUsers={bannedUsers}
            banUser={banUser}
            unbanUser={unbanUser}
            muteUser={muteUser}
            unmuteUser={unmuteUser}
            deleteMessage={deleteMessage}
          />
        ))}
      <div ref={messagesEndRef} />
      <Modal
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        title='Ban User'
      >
        <div className='p-4'>
          <p className='mb-4'>Select how long to ban this user:</p>
          <div className='flex flex-col gap-2'>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='banDuration'
                value='1hours'
                className='radio'
                onChange={handleBanDurationChange}
              />
              <span>1 hour</span>
            </label>

            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='banDuration'
                value='24hours'
                className='radio'
                onChange={handleBanDurationChange}
              />

              <span>24 hours</span>
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='banDuration'
                value='168hours'
                className='radio'
                onChange={handleBanDurationChange}
              />
              <span>1 week (168 hours)</span>
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='banDuration'
                value='720hours'
                className='radio'
                onChange={handleBanDurationChange}
              />
              <span>30 days (720 hours)</span>
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='banDuration'
                value='permanent'
                className='radio'
                onChange={handleBanDurationChange}
              />
              <span>Permanent</span>
            </label>
            <button
              className='site-button purple width-full mt-4'
              onClick={() => {
                if (banDuration) {
                  handleBanUser();
                  setIsBanModalOpen(false);
                }
              }}
            >
              Ban User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatMessages;
