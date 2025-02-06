import React from 'react';

type FlagProps = {
  channel: string;
  name: string;
  imageSrc: string;
  isActive?: boolean;
  newMessages?: number;
  onClick: () => void;
};

const Channel: React.FC<FlagProps> = ({
  channel,
  name,
  imageSrc,
  isActive = false,
  newMessages = 0,
  onClick
}) => {
  return (
    <div
      className={`flag rounded-1 flex items-center justify-center relative ${isActive ? 'active' : ''}`}
      data-channel={channel}
      data-name={name}
      onClick={onClick}
    >
      <img className='rounded-full' src={imageSrc} alt={name} />
      <div
        className={`sop-medium-right bg-danger rounded-full flex justify-center items-center new-messages ${
          newMessages > 0 ? '' : 'hidden'
        }`}
      >
        {newMessages}
      </div>
    </div>
  );
};

export default Channel;
