import React from 'react';
import UserGameResult from './UserGameResult';
import LevelProgress from './LevelProgress';
import ProfileOverview from './ProfileOverview';
import SteamSettings from './SteamSettings';
import MyDevices from './MyDevices';

type Props = {
  userData: any;
  onChangeProfileData: (key: string, value: any) => void;
};

function ProfileTabOne({ userData, onChangeProfileData }: Props) {
  return (
    <div className='flex column responsive gap-1'>
      <div className='grid split-column-2 responsive gap-1'>
        <UserGameResult
          userData={{
            username: userData.profile.username,
            userId: userData.profile.userid,
            avatarUrl: userData.profile.avatar,
            winAmount: userData.user_stats.win,
            betAmount: userData.user_stats.bet,
            profitAmount:
              parseFloat(userData.user_stats.win) -
              parseFloat(userData.user_stats.bet),
          }}
        />
        <LevelProgress
          currentLevel={userData.level.level}
          currentXP={userData.level.have}
          nextLevelXP={userData.level.next}
          key={111}
        />
      </div>
      <div className='grid split-column-2 responsive gap-1'>
        <ProfileOverview
          profileData={{
            registrationDate: new Date(
              Number(userData.profile.time_create) * 1000
            ).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            userid: userData.profile.userid,
            email: userData.profile.email,
            availableBalance: parseFloat(userData.profile.balance),
            availableWithdraw: parseFloat(userData.profile.available),
            anonymous: userData.profile.anonymous,
            privateMode: userData.profile.private,
            isVerified: userData.profile.verified,
            isTwoFactorEnabled: userData.twofa,
            sounds: userData.sounds,
          }}
          onChangeProfileData={onChangeProfileData}
        />
        <div className='flex column responsive gap-1'>
          <SteamSettings
            searchTradeLink={userData.profile.tradelink}
            streamApiKey={userData.profile.apikey}
            onChangeProfileData={onChangeProfileData}
          />
          <MyDevices
            devices={[
              {
                id: 1,
                browser: 'Chrome',
                date: '2023-01-01 12:00:00',
                device: 'Desktop',
                location: 'United States',
              },
            ]}
            onRemoveSession={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileTabOne;
