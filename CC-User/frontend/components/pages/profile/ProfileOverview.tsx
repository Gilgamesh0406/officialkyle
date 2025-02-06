import React, { useEffect, useState } from 'react';
import ToggleSwitch from '../casebattle/create/ToggleSwitch';
import { ProfileData } from '@/lib/client/types';
import { underDevelopment } from '@/lib/client/utils';
import { toast } from 'react-toastify';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useSocketIoClient } from '@/hooks/useSocketIoClient';

interface ProfileOverviewProps {
  profileData: ProfileData;
  onChangeProfileData: (key: string, value: any) => void;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  profileData,
  onChangeProfileData,
}) => {
  const clientSocket = useSocketIoClient();
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [bonusCode, setBonusCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLevel, setUserLevel] = useState('0');
  const [discordId, setDiscordId] = useState('');

  const handleDiscordJoin = () => {
    if (!profileData) {
      toast.error('Please login first to claim your Discord bonus!');
      return;
    }
    window.open('https://discord.gg/qgZmMF5g', '_blank');
    setIsVerifyModalOpen(true);
  };

  const handleDiscordUnlink = async () => {
    try {
      const response = await fetch('/api/discord/unlink', {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data);
      if (data.message === 'Unlink') {
        toast.success('Discord account unlinked successfully!');
        setDiscordId('');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/verify-discord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification successful! Bonus claimed!');
        setIsVerifyModalOpen(false);
        clientSocket?.sendBalanceRequest();
        loadDiscordId();
        // Optionally refresh user data to show updated diesel amount
      } else {
        console.log(data);
        toast.error(data.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBonusCode = async () => {
    try {
      const response = await fetch('/api/claim-bonus', {
        method: 'POST',
        body: JSON.stringify({ bonusCode }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Bonus claimed!');
        clientSocket?.sendBalanceRequest();
      } else {
        toast.error(data.error || 'Bonus claim failed. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };
  const loadDiscordId = async () => {
    const response = await fetch(`/api/discord`);
    const data = await response.json();
    setDiscordId(data.discord_id);
  };

  useEffect(() => {
    const loadUserLevel = async () => {
      const response = await fetch('/api/users/level');
      const data = await response.json();
      setUserLevel(data.level);
    };

    loadUserLevel();
    loadDiscordId();
  }, []);

  return (
    <div className='bg-light-transparent rounded-1 b-l2 p-2'>
      <div className='title-page flex items-center justify-center mb-2'>
        Profile Overview
      </div>
      <div className='flex column items-start gap-1'>
        <div className='text-left font-8'>
          Registered - {profileData.registrationDate}
        </div>
        <div className='text-left font-8 flex'>
          Available Balance -{' '}
          <span className='text-success flex'>
            {profileData.availableBalance.toFixed(2)}
            <img style={{ height: 25 }} src='/imgs/coins.webp' alt='Coins' />
          </span>
        </div>
        <div className='text-left font-8 flex'>
          Available Withdraw -{' '}
          <span className='text-success flex'>
            {profileData.availableWithdraw.toFixed(2)}
            <img style={{ height: 25 }} src='/imgs/coins.webp' alt='Coins' />
          </span>
        </div>
        <div className='flex column items-start gap-1'>
          <div className='text-left font-8'>
            Profile Status -{' '}
            <span
              className={
                profileData.isVerified ? 'text-success' : 'text-danger'
              }
            >
              {profileData.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          {!profileData.isVerified && (
            <>
              <div className='text-left'>
                You have not received an e-mail to verify your profile you can
                resend it.
              </div>
              <button
                className='site-button purple mt-1'
                onClick={underDevelopment}
              >
                Send verification e-mail
              </button>
            </>
          )}
        </div>
        <div className='flex column items-start gap-1'>
          <div
            className={`input_field transition  ${parseFloat(userLevel) < 5 || !discordId ? 'disabled' : ''}`}
            data-border='#de4c41'
            style={{
              border: '2px solid var(--site-color-bg-dark)',
              color: 'unset',
            }}
          >
            <Input
              label='Bonus Code'
              name='Bonus-code'
              value={bonusCode}
              onInput={(e) => setBonusCode(e.target.value)}
              extra={
                <button
                  className='site-button purple'
                  onClick={handleBonusCode}
                >
                  Claim Bonus
                </button>
              }
            />
          </div>
        </div>
        {/* Toggle switches for sounds, anonymous mode, and private mode */}
        <div className='flex items-end gap-2'>
          <ToggleSwitch
            title='Sounds'
            checked={profileData.sounds}
            onChange={() => onChangeProfileData('sounds', !profileData.sounds)}
            name=''
            description=''
          />
          If enabled, the game sounds will be active.
        </div>
        <div className='flex items-end gap-2'>
          <ToggleSwitch
            title='Anonymous'
            checked={profileData.anonymous}
            onChange={() =>
              onChangeProfileData('anonymous', !profileData.anonymous)
            }
            name=''
            description=''
          />
          <div className='text-left'>
            If enabled, your profile name and avatar will be anonymously.
          </div>
        </div>
        <div className='flex items-end gap-2'>
          <ToggleSwitch
            title='Private Mode'
            checked={profileData.privateMode}
            onChange={() =>
              onChangeProfileData('privateMode', !profileData.privateMode)
            }
            name=''
            description=''
          />
          If enabled, your profile will be private.
        </div>
        <div className='flex column items-start gap-1 width-full'>
          <div className='text-left font-8'>Connections</div>

          <div className='flex bg-light rounded-1 gap-1 width-full'>
            <div className='flex items-stretch bg-dark rounded-1 p-3'>
              <img
                src='/imgs/social/discord_icon.png'
                alt='Discord'
                style={{ height: 20, marginTop: 'auto', marginBottom: 'auto' }}
              />
            </div>
            <div className='flex flex-col justify-center text-left p-3'>
              <p className='font-8'>Discord</p>
              <span className='text-gray font-6'>{discordId || ''}</span>
            </div>
            <div className='ml-auto mt-auto mb-auto mr-2'>
              {discordId ? (
                <button
                  className='site-button purple col-span-2'
                  onClick={handleDiscordUnlink}
                >
                  Unlink
                </button>
              ) : (
                <button
                  className={`site-button purple col-span-2`}
                  onClick={handleDiscordJoin}
                >
                  + LINK ACCOUNT
                </button>
              )}
            </div>
          </div>

          <div className='flex bg-light rounded-1 gap-1 width-full'>
            <div className='flex items-stretch bg-dark rounded-1 p-3'>
              <img
                src='/imgs/social/steam_icon.png'
                alt='Steam'
                style={{ height: 20, marginTop: 'auto', marginBottom: 'auto' }}
              />
            </div>
            <div className='flex flex-col justify-center text-left p-3'>
              <p className='font-8'>Steam</p>
              <span className='text-gray font-6'>{profileData.email}</span>
            </div>
          </div>
          <div className='grid split-column-4 gap-1 width-full'></div>
        </div>
        <div className='flex column items-start gap-1 width-full'>
          <div className='text-left font-8'>
            Self Exclusion - <span className='text-danger'>Inactive</span>
          </div>
          <div className='grid split-column-3 gap-1 width-full'>
            <button className='site-button purple' onClick={underDevelopment}>
              24 hours
            </button>
            <button className='site-button purple' onClick={underDevelopment}>
              7 days
            </button>
            <button className='site-button purple' onClick={underDevelopment}>
              30 days
            </button>
          </div>
          <div className='flex column items-start gap-1 text-left'>
            <div>
              If enabled, you won't be able to bet, claim rewards, send diesel
              or deposit anything until the restriction expires.
            </div>
            <div>
              Withdraws and chat privileges will remain active. Use it if you'd
              like to take a break from playing for an extended period. For
              custom restrictions, you can always contact us.
            </div>
            <div className='text-danger'>
              During this time, we will NOT remove your restrictions for ANY
              reason, even if you change your mind.
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title='Verify Discord Join'
      >
        <div className='p-4'>
          <p className='mb-4'>
            Please enter the verification code sent to you in our Discord
            server:
          </p>

          <div
            className='input_field transition'
            data-border='#de4c41'
            style={{
              border: '2px solid var(--site-color-bg-dark)',
              color: 'unset',
            }}
          >
            <Input
              label='Verification Code'
              name='verification-code'
              value={verificationCode}
              onInput={(e) => setVerificationCode(e.target.value)}
            />
          </div>
          <button
            className='site-button purple width-full'
            onClick={handleVerifyCode}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileOverview;
