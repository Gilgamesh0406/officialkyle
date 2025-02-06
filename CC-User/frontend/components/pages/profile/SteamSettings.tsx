//@ts-nocheck
import Input from '@/components/ui/Input';
import React from 'react';

interface SteamSettingsProps {
  searchTradeLink: string;
  streamApiKey: string;
  onChangeProfileData: (key: string, value: any) => void;
}

const SteamSettings = ({
  searchTradeLink,
  streamApiKey,
  onChangeProfileData,
}: SteamSettingsProps) => {
  return (
    <div className='bg-light-transparent rounded-1 b-l2 p-2'>
      <div className='title-page flex items-center justify-center mb-2'>
        Steam Settings
      </div>
      <div className='flex column items-start gap-2'>
        <div
          className='input_field transition'
          data-border='#de4c41'
          style={{
            border: '2px solid var(--site-color-bg-dark)',
            color: 'unset',
          }}
        >
          <Input
            label='Search Trade Link'
            name='searchTradeLink'
            value={searchTradeLink ?? ''}
            onInput={(e) => {
              onChangeProfileData('tradelink', e.target.value);
            }}
            extra={
              <button className='site-button purple' id='save_steam_tradelink'>
                Confirm
              </button>
            }
          />
          <div className='field_bottom'>
            <div className='field_error active' data-error='default'>
              You can find it{' '}
              <a
                className='text-color'
                href='https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url'
                target='_blank'
                rel='noopener noreferrer'
              >
                here
              </a>
              .
            </div>
            <div className='field_error' data-error='steam_trade_link'>
              This field must be a Steam Trade Link
            </div>
          </div>
        </div>
        <div
          className='input_field transition'
          data-border='#de4c41'
          style={{
            border: '2px solid var(--site-color-bg-dark)',
            color: 'unset',
          }}
        >
          <Input
            label='Steam API Key'
            name='streamApiKey'
            value={streamApiKey ?? ''}
            onInput={(e) => {
              onChangeProfileData('apikey', e.target.value);
            }}
            extra={
              <button className='site-button purple' id='save_steam_apiky'>
                Confirm
              </button>
            }
          />
          <div className='field_bottom'>
            <div className='field_error active' data-error='default'>
              You can find it{' '}
              <a
                className='text-color'
                href='https://steamcommunity.com/dev/apikey'
                target='_blank'
                rel='noopener noreferrer'
              >
                here
              </a>
              .
            </div>
            <div className='field_error' data-error='steam_api_key'>
              This field must be a Steam API Key
            </div>
          </div>
        </div>
        <div className='flex column items-start gap-1 text-left'>
          <div>
            Do not share this API Key with anyone else. Our staff will NEVER ask
            you for it.
          </div>
          <div className='text-danger'>
            We are checking your API Key everytime you Deposit or Withdraw on
            P2P. If you revoke the API Key during a P2P Trade Offer you will
            lose your items or your diesel, and you will receive a trade ban.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SteamSettings;
