import {
  faComments,
  faSmile,
  faTimes,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  ChangeEvent,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  useIsSocketConnected,
  useSocketIoClient,
} from '@/hooks/useSocketIoClient';
import ChatMessages from './ChatMessages';
import onMessageSocket from '@/lib/client/socket-message-handler';
import { emojis, pepe, faces, gifs, messages } from '@/lib/client/chat-library';
import { getProfileSettingValue } from '@/lib/client/profile-settings';
import { UserMessageType } from '@/lib/client/types';
import EmojisPanel from './EmojisPanel';
import ChannelSelect from './ChannelSelect';
import ChatPanelHeader from './ChatPanelHeader';
import RainPanel from './RainPanel';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import useRank from '@/hooks/useRank';

const Chat = ({
  onChatOpen,
  chatOpen,
}: {
  onChatOpen: (val: boolean) => void;
  chatOpen: boolean;
}) => {
  const clientSocket = useSocketIoClient();
  const isSocketConnected = useIsSocketConnected();

  const pathname = usePathname();
  const [online, setOnline] = useState(0);
  const handleChat = () => {
    onChatOpen(true);
  };
  const { rank } = useRank();

  /**
   * Messaging
   */
  const [inputVal, setinputVal] = useState('');
  const [user_messages, setUserMessages] = useState<UserMessageType[]>([]);
  const [emojiBarOpen, setEmojiBarOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<string>('en');
  const [session, setSession] = useState(
    () => Cookies.get('session') || undefined
  );
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [lastMessage, setLastMessage] = useState<number>(-1);

  useEffect(() => {
    const cookieUserId = Cookies.get('userid'); // Get the 'userid' cookie
    if (cookieUserId) {
      setUserId(cookieUserId);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSession = Cookies.get('session');
      if (newSession !== session) {
        setSession(newSession); // Update session state
      }
    }, 1000); // Check every 1 second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [session]);

  const onInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setinputVal(e.target.value);
  }, []);
  const sendChat = () => {
    if (clientSocket && inputVal.trim() !== '') {
      clientSocket.sendRequest({
        type: 'chat',
        command: 'message',
        message: inputVal.trim(),
        channel: currentChannel,
      });
      setinputVal('');
    }
  };

  useEffect(() => {
    if (!clientSocket || !clientSocket.isConnected) {
      return;
    }

    const receiveMessageHandler = (receivedMessage: any) => {
      const { error, data } = onMessageSocket(receivedMessage);
      if (receivedMessage.type === 'success') {
        toast.success(data.success);
      }
      if (error) {
        toast.error(data.error);
        return;
      }
      if (data.type === 'first') {
        const firstMessages: any[] = [];
        data.chat.messages.forEach((message: any) => {
          const checkedMsg = {
            ...message,
            message: checkEmotes(message.message),
          };
          firstMessages.push(checkedMsg);
        });
        setUserMessages(firstMessages);
      } else if (data.type === 'online') {
        //set online
        setOnline(data.online);
      } else if (data.type === 'chat') {
        if (data.command === 'delete') {
          console.log('[data]', data, '[user_messages]', user_messages);
          setUserMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== parseInt(data.id))
          );
        } else {
          const checkedMsg = {
            ...receivedMessage.message,
            message: checkEmotes(receivedMessage.message.message),
          };
          setUserMessages((prevMessages) => [...prevMessages, checkedMsg]);
        }
      }

      // toast.info(data);
    };

    clientSocket.subscribe('message', receiveMessageHandler);
    // on home page join
  }, [clientSocket, isSocketConnected, user_messages]);

  useEffect(() => {
    if (!clientSocket || !clientSocket.isConnected) {
      return;
    }
    if (pathname !== '') {
      clientSocket.send('join', {
        session: session,
        paths: ['home'],
        channel: getProfileSettingValue('channel') || 'en',
      });
    } else if (pathname.includes('profile')) {
      clientSocket.send('join', {
        session: session,
        paths: ['profile'],
        channel: getProfileSettingValue('channel') || 'en',
      });
    }
    return () => {
      clientSocket.removeAllListeners();
    };
  }, [clientSocket, isSocketConnected, session]);

  /**
   * handle emoji panel open and close,
   */

  const onHandleEmoji = (emoji: string) => {
    setinputVal(inputVal + ':' + emoji + ':');
  };
  const onHandleMention = (userid: string) => {
    setinputVal(inputVal + ' @' + userid);
  };
  const toggleEmojiBar = (flag: boolean) => {
    setEmojiBarOpen(flag);
  };

  const checkEmotes = (message: String): JSX.Element => {
    const emotes: Record<string, string> = {
      smile: 'png',
      smiley: 'png',
      grin: 'png',
      pensive: 'png',
      weary: 'png',
      astonished: 'png',
      rolling_eyes: 'png',
      relaxed: 'png',
      wink: 'png',
      woozy_face: 'png',
      zany_face: 'png',
      hugging: 'png',
      joy: 'png',
      sob: 'png',
      grimacing: 'png',
      rofl: 'png',
      face_monocle: 'png',
      thinking: 'png',
      pleading_face: 'png',
      sleeping: 'png',
      sunglasses: 'png',
      heart_eyes: 'png',
      smiling_hearts: 'png',
      kissing_heart: 'png',
      star_struck: 'png',
      nerd: 'png',
      innocent: 'png',
      face_vomiting: 'png',
      money_mouth: 'png',
      cold_sweat: 'png',
      partying_face: 'png',
      exploding_head: 'png',
      rage: 'png',
      hot_face: 'png',
      cold_face: 'png',
      smiling_imp: 'png',
      alien: 'png',
      clown: 'png',
      scream_cat: 'png',
      smiley_cat: 'png',
      robot: 'png',
      ghost: 'png',
      skull: 'png',
      poop: 'png',
      jack_o_lantern: 'png',
      '100': 'png',
      bell: 'png',
      birthday: 'png',
      gift: 'png',
      first_place: 'png',
      trophy: 'png',
      tada: 'png',
      crown: 'png',
      fire: 'png',
      heart: 'png',
      broken_heart: 'png',
      wave: 'png',
      clap: 'png',
      raised_hands: 'png',
      thumbsup: 'png',
      peace: 'png',
      ok_hand: 'png',
      muscle: 'png',
      punch: 'png',
      moneybag: 'png',
      crypepe: 'png',
      firinpepe: 'png',
      happepe: 'png',
      monkachrist: 'png',
      okpepe: 'png',
      sadpepe: 'png',
      gaben: 'png',
      kappa: 'png',
      kappapride: 'png',
      kim: 'png',
      pogchamp: 'png',
      shaq: 'png',
      alert: 'gif',
      awp: 'gif',
      bananadance: 'gif',
      carlton: 'gif',
      fortdance: 'gif',
      grenade: 'gif',
      lolizard: 'gif',
      partyblob: 'gif',
      saxguy: 'gif',
      squidab: 'gif',
      turtle: 'gif',
      zombie: 'gif',
      bet: 'png',
      cant: 'png',
      cashout: 'png',
      doit: 'png',
      dont: 'png',
      feelsbad: 'png',
      feelsgood: 'png',
      gg: 'png',
      gl: 'png',
      highroller: 'png',
      joinme: 'png',
      letsgo: 'png',
      win: 'png',
      lose: 'png',
      nice: 'png',
      sniped: 'png',
      midtick: 'png',
      lowtick: 'png',
    };

    const parts = message.split(/(:\w+:)/g).map((part, index) => {
      if (emotes[part.slice(1, -1)]) {
        const ext = emotes[part.slice(1, -1)];
        return (
          <img
            key={index}
            className='emojis-chat-icon'
            src={`/imgs/emojis/${part.slice(1, -1)}.${ext}`}
            alt={part}
          />
        );
      }
      return part; // Return the original text if not an emote
    });

    return <>{parts}</>; // Wrap in a fragment to return multiple elements
  };

  const onChangeChannel = (lang: string) => {
    setCurrentChannel(lang);
  };

  return (
    <>
      <div
        onClick={handleChat}
        className='slider slider-left text-left slider-top flex justify-end transition-5 show_chat p-2 pullout_view'
        data-pullout='chat'
      >
        <FontAwesomeIcon icon={faComments} className='w-[20px]' />
      </div>
      <div
        className='pullout pullout-left flex column transition-5 active'
        data-pullout='chat'
        style={{ left: chatOpen ? '0px' : '-275px', width: '275px' }}
      >
        <div className='m-2'>
          <ChatPanelHeader onChatOpen={onChatOpen} online={online} />
          <ChannelSelect
            onChangeChannel={(lang) => {
              onChangeChannel(lang);
            }}
          />
        </div>

        <RainPanel />

        <div className='chat-group flex column'>
          <div id='chat-area'>
            <ChatMessages
              isSocketConnected={isSocketConnected}
              messages={user_messages}
              currentChannel={currentChannel}
              userId={userId}
              rank={rank}
              onHandleMention={onHandleMention}
            />
          </div>
          <div>
            <EmojisPanel
              emojis={emojis}
              pepe={pepe}
              faces={faces}
              gifs={gifs}
              emojiBarOpen={emojiBarOpen}
              onHandleEmoji={onHandleEmoji}
              messages={messages}
            />
          </div>

          <div className='chat-input'>
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => {
                  toggleEmojiBar(!emojiBarOpen);
                }}
                className='emojis-smile-icon flex justify-center items-center'
                data-type='show'
              >
                {emojiBarOpen ? (
                  <FontAwesomeIcon icon={faTimes} className='w-[20px]' />
                ) : (
                  <FontAwesomeIcon icon={faSmile} className='w-[20px]' />
                )}
              </div>

              <input
                onInput={onInput}
                type='text'
                className='chat-input-field'
                placeholder='Chat...'
                id='chat_message'
                value={inputVal}
                maxLength={200}
                autoComplete='off'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendChat();
                  }
                }}
              />
              <div className='chat-input-scroll items-center justify-center hidden'>
                Scroll to recent messages
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
