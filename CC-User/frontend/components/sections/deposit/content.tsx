'use client';

import VerifyCaptchaModal from '@/components/modals/VerifyCaptchaModal';
import Input from '@/components/ui/Input';
import { SiteSetting } from '@/lib/client/types';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';

const DepositContent = () => {
  const [bonusVal, setBonusVal] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userLevel, setUserLevel] = useState('0');
  const [steamRestricted, setSteamRestricted] = useState(true);
  const [cryptoRestricted, setCryptoRestricted] = useState(true);
  const [p2pRestricted, setP2PRestricted] = useState(true);
  const [realRestricted, setRealRestricted] = useState(true);

  useEffect(() => {
    const loadUserLevel = async () => {
      const response = await fetch('/api/users/level');
      const data = await response.json();
      setUserLevel(data.level);
    };

    loadUserLevel();
  }, []);

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBonusVal(value);
  };

  useEffect(() => {
    const item = localStorage.getItem('siteSettings'); // Replace 'yourKey' with the actual key
    const jsonData = JSON.parse(item ? item : '');
    setSteamRestricted(
      jsonData.findIndex(
        (v: SiteSetting) => v.key === 'deposit_steam' && v.value === 'true'
      ) == -1
    );
    setP2PRestricted(
      jsonData.findIndex(
        (v: SiteSetting) => v.key === 'deposit_p2p' && v.value === 'true'
      ) == -1
    );
    setCryptoRestricted(
      jsonData.findIndex(
        (v: SiteSetting) =>
          v.key === 'deposit_crypto_currency' && v.value === 'true'
      ) == -1
    );
    setRealRestricted(
      jsonData.findIndex(
        (v: SiteSetting) => v.key === 'deposit_real_money' && v.value === 'true'
      ) == -1
    );
  }, []);

  return (
    <>
      <div className='flex column width-full'>
        <div className='wrapper-page flex row'>
          <div className='flex column width-full overflow-a p-2 gap-2'>
            <div className='width-3 responsive'>
              <div
                className='input_field transition'
                data-border='#de4c41'
                style={{
                  border: '2px solid var(--site-color-bg-dark)',
                  color: 'unset',
                }}
              >
                <Input
                  label='5% Deposit Bonus'
                  name='deposit-bonus'
                  value={bonusVal}
                  onInput={onInput}
                  extra={
                    <button
                      onClick={() => setModalIsOpen(true)}
                      className='site-button purple'
                      id='deposit_bonus_apply'
                    >
                      Apply
                    </button>
                  }
                />

                <div className='field_bottom'></div>
              </div>
            </div>

            <div className='flex column gap-4 text-left'>
              {!steamRestricted && (
                <div>
                  <div className='offers-options-name'>Deposit with Steam</div>

                  <div className='offers-options mt-2'>
                    <Link className='' href='/deposit/steam/csgo'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/csgo_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          CSGO
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/steam/dota2'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/dota2_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          DOTA2
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/steam/tf2'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/tf2_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          TF2
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/steam/rust'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/rust_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          RUST
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/steam/h1z1'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/h1z1_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          H1Z1
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
              {!p2pRestricted && (
                <div>
                  <div className='offers-options-name'>Deposit with P2P</div>

                  <div className='offers-options mt-2'>
                    <Link className='' href='/deposit/p2p/csgo'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/csgo_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          CSGO
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/p2p/dota2'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/dota2_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          DOTA2
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/p2p/tf2'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/tf2_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          TF2
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/p2p/rust'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/rust_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          RUST
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/p2p/h1z1'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/h1z1_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          H1Z1
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
              {!cryptoRestricted && (
                <div>
                  <div className='offers-options-name'>
                    Deposit with Cryptocurrency
                  </div>

                  <div className='offers-options mt-2'>
                    <Link className='' href='/deposit/crypto/btc'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/btc_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          Bitcoin (BTC)
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/crypto/eth'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/eth_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          Ethereum (ETH)
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/crypto/ltc'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/ltc_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          Litecoin (LTC)
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/crypto/bch'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/bch_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          Bitcoin Cash (BCH)
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/crypto/usdc'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/usdc_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          USD Coin (USDC)
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/crypto/usdt'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/usdt_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          Tether (USDT)
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/crypto/doge'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/doge_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          Dogecoin (DOGE)
                        </div>
                      </div>
                    </Link>
                    <Link className='' href='/deposit/crypto/xrp'>
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/xrp_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          Ripple (XRP)
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
              {!realRestricted && (
                <div>
                  <div className='offers-options-name'>
                    Deposit with Real Money{' '}
                    {parseFloat(userLevel) < 5 && (
                      <strong>(You must be at least Steam level 5)</strong>
                    )}
                  </div>

                  <div className='offers-options mt-2'>
                    <Link
                      className={parseFloat(userLevel) < 5 ? 'disabled' : ''}
                      href='/deposit/realmoney/credit_card'
                    >
                      <div className='offers-option p-2 rounded-2'>
                        <div className='offers-option-image-content flex items-center justify-center rounded-1'>
                          <img
                            className='offers-option-image'
                            src='/imgs/methods/cards_shop.png?v=1714493328'
                          />
                        </div>

                        <div className='offers-option-name flex justify-center items-center'>
                          Credit Cards
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <VerifyCaptchaModal
        isOpen={modalIsOpen}
        setIsOpen={(val: boolean) => setModalIsOpen(val)}
      />
    </>
  );
};

export default DepositContent;
