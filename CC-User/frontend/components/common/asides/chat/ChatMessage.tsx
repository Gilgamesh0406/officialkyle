import Avatar from './Avatar';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import { UserMessageType } from '@/lib/client/types';
import { useEffect, useState, useRef } from 'react';
import {
  faAt,
  faUser,
  faEllipsis,
  faVolumeMute,
  faBan,
  faVolumeUp,
  faTrash,
  faUnlock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type ChatMessageProps = {
  message: UserMessageType;
  userId: string | undefined;
  mutedUsers: string[]; // List of muted user IDs
  onHandleMention: (userid: string) => void;
  rank: number;
  bannedUsers: string[];
  banUser: (userid: string) => void;
  unbanUser: (userid: string) => void;
  muteUser: (userid: string) => void;
  unmuteUser: (userid: string) => void;
  deleteMessage: (id: number) => void;
};

const ChatMessage = ({
  message,
  userId,
  mutedUsers,
  onHandleMention,
  rank,
  bannedUsers,
  banUser,
  unbanUser,
  muteUser,
  unmuteUser,
  deleteMessage,
}: ChatMessageProps) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isUserMessage = message.user && message.user.userid === userId;
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    setIsMuted(mutedUsers.includes(message.user?.userid ?? '-1'));
  }, [mutedUsers, message]);

  useEffect(() => {
    setIsBanned(bannedUsers.includes(message.user?.userid ?? '-1'));
  }, [bannedUsers, message]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const mute = () => {
    if (!userId) return;
    muteUser(userId);
  };

  const unmute = () => {
    if (!userId) return;
    unmuteUser(userId);
  };

  const ban = () => {
    if (!userId) return;
    banUser(userId);
  };

  const unban = () => {
    if (!userId) return;
    unbanUser(userId);
  };

  return (
    <div className={`chat ${isUserMessage ? 'chat-end' : 'chat-start'}`}>
      <div className='chat-message p-1 bounce_center'>
        <div className='flex relative width-full chat-user-info group'>
          <Avatar user={message.user} />
          <ChatHeader message={message} />

          {/* Dropdown menu */}
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className='px-2 hover:text-gray-500'
              aria-label='Message options'
            >
              <FontAwesomeIcon icon={faEllipsis} size='lg' />
            </button>

            {showDropdown && (
              <div
                className='absolute right-0 mt-2 w-48 bg-light rounded-md shadow-lg z-50 py-1'
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    onHandleMention(message.user?.userid ?? '');
                    setShowDropdown(false);
                  }}
                  className='block w-full text-left px-4 py-2 text-sm text-white bg-light hover:bg-red-900 transition-colors'
                >
                  <span className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faAt} size='sm' />
                    Mention
                  </span>
                </button>
                <button
                  onClick={() => {
                    router.push(`/profile/${message.user?.userid}`);
                    setShowDropdown(false);
                  }}
                  className='block w-full text-left px-4 py-2 text-sm text-white bg-light hover:bg-red-900  transition-colors'
                >
                  <span className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faUser} size='sm' />
                    Profile
                  </span>
                </button>
                {rank > 0 && (
                  <>
                    <button
                      className='block w-full text-left px-4 py-2 text-sm text-white bg-light hover:bg-red-900  transition-colors'
                      onClick={isMuted ? unmute : mute}
                    >
                      <span className='flex items-center gap-2'>
                        <FontAwesomeIcon
                          icon={isMuted ? faVolumeUp : faVolumeMute}
                          size='sm'
                        />
                        {isMuted ? 'Unmute' : 'Mute'}
                      </span>
                    </button>
                    <button
                      className='block w-full text-left px-4 py-2 text-sm text-white bg-light hover:bg-red-900  transition-colors'
                      onClick={isBanned ? unban : ban}
                    >
                      <span className='flex items-center gap-2'>
                        <FontAwesomeIcon
                          icon={isBanned ? faUnlock : faBan}
                          size='sm'
                        />
                        {isBanned ? 'Unban' : 'Ban'} this user
                      </span>
                    </button>
                    <button
                      className='block w-full text-left px-4 py-2 text-sm text-white bg-light hover:bg-red-900  transition-colors'
                      onClick={() => deleteMessage(message.id)}
                    >
                      <span className='flex items-center gap-2'>
                        <FontAwesomeIcon icon={faTrash} size='sm' />
                        Delete message
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <ChatContent message={message} isMuted={isMuted} />
      </div>
    </div>
  );
};

export default ChatMessage;
