'use client';
import { HeaderProps, NavMenuType, SiteSetting } from '@/lib/client/types';
import { faCaretDown, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import HeaderSocialPlatforms from './HeaderSocialPlatforms';
import UserLevel from './UserLevel';
import Logout from './Logout';
import CountTo from '../CountTo';
import { useEffect, useState } from 'react';

interface User {
  personaname: string;
  avatar: string; // Add other fields if needed
}
const HeaderMax = ({
  session,
  pathname,
  filteredRoutes,
  setDailyCaseOpen,
  setsetSettingsModalIsOpen,
  userData,
  setInventoryOpen,
}: HeaderProps) => {
  const { data, status } = session;
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/status');
      const { authenticated, playerData } = await res.json();

      setLoggedIn(authenticated);
      setUser(playerData);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    // Redirect to the Steam login route
    document.location.href = '/api/auth/steam';
  };

  const handleOnClick = () => {
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;
    if (!baseUrl) {
      console.error('Base URL is not defined in environment variables.');
      return;
    }
    // Construct the Steam OpenID login URL
    const steamLoginUrl =
      `https://steamcommunity.com/openid/login?` +
      `client_id=your-steam-client-id&` +
      `scope=openid&response_type=code&` +
      `redirect_uri=${encodeURIComponent(`${baseUrl}/api/auth/callback/steam`)}&` +
      `openid.ns=${encodeURIComponent('http://specs.openid.net/auth/2.0')}&` +
      `openid.mode=checkid_setup&` +
      `openid.return_to=${encodeURIComponent(`${baseUrl}/api/auth/callback/steam`)}&` +
      `openid.identity=${encodeURIComponent('http://specs.openid.net/auth/2.0/identifier_select')}&` +
      `openid.claimed_id=${encodeURIComponent('http://specs.openid.net/auth/2.0/identifier_select')}`;

    // Redirect to the Steam login URL
    window.location.href = steamLoginUrl;
  };

  const handleLogout = () => {
    document.location.href = '/api/auth/logout';
  };
  return (
    <>
      <div className='header-max'>
        <div className='header layout flex'>
          <div className='header-logo flex justify-center items-center'>
            <Link className='flex justify-center items-center' href='/'>
              <Image
                src='/imgs/testlogo.png?v=1714110404'
                alt='logo'
                width={100}
                height={100}
              />
            </Link>
          </div>

          <div className='header-menu-top flex items-center justify-between'>
            <div className='inline-block'>
              <div className='inline-block'>
                {filteredRoutes.map((navItem: NavMenuType, index: number) => (
                  <div
                    key={index}
                    className='header-menu-button inline-block mr-3'
                  >
                    <span className='text-[15px] font-bold leading-[18px]'>
                      <Link
                        href={navItem.to}
                        className={navItem.textClassname || ''}
                      >
                        {navItem.text}
                      </Link>
                    </span>
                  </div>
                ))}
              </div>

              <HeaderSocialPlatforms />
            </div>
            {data && data.user && (
              <div className='flex items-center mt-1 gap-2 height-full pr-2'>
                <UserLevel
                  have={userData.level.have}
                  level={userData.level.level}
                  next={userData.level.next}
                  start={userData.level.start}
                />
                <Logout />
              </div>
            )}
          </div>

          <div className='header-menu-bottom flex items-center justify-between'>
            <div className='flex items-center gap-4 height-full'>
              <div className='header-menu-button'>
                <div className='header-button-games flex items-center'>
                  <div className='mr-1'>All games</div>
                  <FontAwesomeIcon icon={faCaretDown} className='w-[8px]' />

                  <div className='header-games'>
                    <div className='header-list-games bg-dark items-center justify-center p-2'>
                      <Link href='/coinflip'>
                        <div className='header-list-game flex items-center justify-center rounded-1 transition-2'>
                          <Image
                            src='/imgs/menu/coinflip.png?v=1714110404'
                            alt='coinflip'
                            width={18}
                            height={18}
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center',
                            }}
                            className='object-contain'
                          />
                          <div className='ml-1'>Coinflip</div>
                        </div>
                      </Link>
                      <Link href='/unboxing'>
                        <div className='header-list-game flex items-center justify-center rounded-1 transition-2'>
                          <Image
                            src='/imgs/menu/unboxing.png?v=1714110404'
                            alt='unboxing'
                            width={18}
                            height={18}
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center',
                            }}
                            className='object-contain'
                          />
                          <div className='ml-1'>Unboxing</div>
                        </div>
                      </Link>
                      <Link href='/casebattle'>
                        <div className='header-list-game flex items-center justify-center rounded-1 transition-2'>
                          <Image
                            src='/imgs/menu/casebattle.png?v=1714110404'
                            alt='casebattle'
                            width={18}
                            height={18}
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center',
                            }}
                            className='object-contain'
                          />
                          <div className='ml-1'>Case Battle</div>
                        </div>
                      </Link>
                      <Link href='/plinko'>
                        <div className='header-list-game flex items-center justify-center rounded-1 transition-2'>
                          <Image
                            src='/imgs/menu/plinko.png?v=1714110404'
                            alt='plinko'
                            width={18}
                            height={18}
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center',
                            }}
                            className='object-contain'
                          />
                          <div className='ml-1'>Plinko</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {userData.siteSettings.findIndex(
                (v: SiteSetting) => v.key === 'deposit' && v.value === 'true'
              ) !== -1 ? (
                <div className='header-menu-button'>
                  <Link href='/deposit'>
                    <div
                      className={`header-side-button flex items-center ${
                        pathname.startsWith('/deposit') ? 'active' : ''
                      }`}
                    >
                      <div className='ml-1'>Deposit</div>
                    </div>
                  </Link>
                </div>
              ) : (
                ''
              )}

              <div className='header-menu-button'>
                <Link href='/withdraw'>
                  <div
                    className={`header-side-button flex items-center ${
                      pathname.startsWith('/withdraw') ? 'active' : ''
                    }`}
                  >
                    <div className='ml-1'>Withdraw</div>
                  </div>
                </Link>
              </div>
              <div
                className='header-menu-button'
                data-modal='show'
                data-id='#modal_dailycases_cases'
                onClick={() => setDailyCaseOpen(true)}
              >
                <div className='header-side-button flex items-center'>
                  <div className='ml-1 text-success'>Daily Cases</div>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2 height-full pr-2'>
              {status && status === 'authenticated' ? (
                <>
                  <div
                    className='header-panel bg-light rounded-1 b-l2 p-1 flex items-center justify-center pointer'
                    data-modal='show'
                    data-id='#modal_user_inventory'
                    onClick={() => setInventoryOpen(true)}
                  >
                    <img
                      src='/imgs/backpack.png'
                      className='w-[30px] !h-[20px]'
                    />
                  </div>

                  <Link className='header-panel' href='/deposit'>
                    <div className='balances bg-light rounded-1 b-l2 pl-2 pr-2 flex row items-center justify-center height-full relative'>
                      <div
                        className='balance flex row items-center justify-center gap-1'
                        data-balance='total'
                      >
                        <div className='coins'></div>
                        <CountTo
                          formatType='balance'
                          targetValue={parseFloat(userData.balance)}
                        />
                      </div>

                      {/* <div className="balances-panel b-m2 bg-light rounded-1 p-2 flex column items-start justify-center gap-1">
                        <div
                          className="balance flex row items-center justify-center gap-1"
                          data-balance="balance"
                        >
                          <span>Balance:</span>
                          <span className="amount">0.00</span>
                        </div>
                      </div> */}
                    </div>
                  </Link>

                  <Link className='header-panel' href='/profile'>
                    <div className='bg-main-transparent rounded-1 b-l2 pl-2 pr-2 flex items-center justify-center height-full'>
                      <img className='rounded-full' src={data.user.image} />
                      <div className='ml-2'>{data.user.name}</div>
                    </div>
                  </Link>
                </>
              ) : (
                <div className='header-panel bg-light rounded-1 b-l2 flex items-center justify-center'>
                  <button
                    className='site-button black height-full flex justify-center items-center pt-0 pb-0'
                    data-modal='show'
                    data-id='#modal_auth'
                    onClick={handleOnClick}
                  >
                    LOGIN WITH STEAM
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderMax;
