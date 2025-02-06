import React, { useState } from 'react';
import Channel from './Channel';

type Props = {
  onChangeChannel: (lang: string) => void;
};

const ChannelSelect: React.FC<Props> = ({ onChangeChannel }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const handleLanguageChange = (channel: string) => {
    setSelectedLanguage(channel);
    onChangeChannel(channel);
    // Perform any other actions on language change (e.g., API calls or updating context)
  };
  const channels = [
    {
      channel: 'en',
      name: 'English',
      imageSrc: '/imgs/lang/en.png?v=1714113066',
      newMessages: 0,
    },
    {
      channel: 'ro',
      name: 'Română',
      imageSrc: '/imgs/lang/ro.png?v=1714113066',
      newMessages: 0,
    },
    {
      channel: 'fr',
      name: 'Français',
      imageSrc: '/imgs/lang/fr.png?v=1714113066',
      newMessages: 0,
    },
    {
      channel: 'ru',
      name: 'Pусский',
      imageSrc: '/imgs/lang/ru.png?v=1714113066',
      newMessages: 0,
    },
    {
      channel: 'de',
      name: 'German',
      imageSrc: '/imgs/lang/de.png?v=1714113066',
      newMessages: 0,
    },
  ];

  return (
    <div className='grid split-column-full gap-1'>
      {channels.map((channel) => (
        <Channel
          key={channel.channel}
          channel={channel.channel}
          name={channel.name}
          imageSrc={channel.imageSrc}
          isActive={selectedLanguage === channel.channel}
          newMessages={channel.newMessages}
          onClick={() => {
            handleLanguageChange(channel.channel);
          }}
        />
      ))}
    </div>
  );
};

export default ChannelSelect;
