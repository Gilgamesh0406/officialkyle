import React from 'react';

interface User {
  avatar: string;
  level: number;
}

interface AvatarFieldProps {
  user: User;
  type: string;
  more?: React.ReactNode;
  classes?: string;
  coinflipPosition?: number;
}

const AvatarField: React.FC<AvatarFieldProps> = ({
  user,
  type,
  more = null,
  classes = '',
  coinflipPosition,
}) => {
  // Determine the level class based on the user's level
  const levelClass = [
    'tier-steel',
    'tier-bronze',
    'tier-silver',
    'tier-gold',
    'tier-diamond',
  ][Math.floor(user.level / 25)];
  return (
    <div
      className={`avatar-field rounded-full ${classes} ${levelClass} relative`}
    >
      <img
        className={`avatar icon-${type} rounded-full`}
        src={user.avatar}
        alt='User Avatar'
      />
      {coinflipPosition !== undefined && (
        <div className='level sop-large-left flex justify-center items-center b-d2 bg-dark rounded-full'>
          <img src={`/imgs/coinflip/coin${coinflipPosition}.png`} alt='Coin' />
        </div>
      )}
      <div
        className={`level sup-${type}-left flex justify-center items-center b-d2 bg-dark rounded-full`}
      >
        {user.level}
      </div>
      {more}
    </div>
  );
};

export default AvatarField;
