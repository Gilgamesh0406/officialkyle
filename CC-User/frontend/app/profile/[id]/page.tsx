'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const page = ({ params }: { params: { id: string } }) => {
  const [tab, setTab] = useState(0);
  const [userData, setUserData] = useState<any>(null);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/profile/${params.id}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [params.id]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { profile, user_stats, level } = userData;
  console.log('[userData]', userData);

  return (
    <>
      <div className='grid split-column-full responsive gap-1 mb-2'>
        <button
          onClick={() => setTab(0)}
          className={`site-button black switch_panel ${tab === 0 ? 'active' : ''}`}
        >
          Summary
        </button>

        <button
          onClick={() => setTab(1)}
          className={`site-button black switch_panel ${tab === 1 ? 'active' : ''}`}
        >
          Stats
        </button>
      </div>

      {tab === 0 ? (
        <div className='flex column responsive gap-1'>
          <div className='grid split-column-2 responsive gap-1'>
            <div className='bg-light-transparent rounded-1 b-l2 p-2'>
              <div className='avatar-field tier-steel'>
                <div className='inline-block relative'>
                  <img
                    className='avatar icon-large rounded-full'
                    src={
                      profile.avatar || 'https://crazycargo.gg/imgs/avatar.jpg'
                    }
                    alt={`${profile.name}'s avatar`}
                  />
                </div>
              </div>

              <div>
                <div className='flex justify-center gap-2 text-upper text-bold ellipsis'>
                  <div className='chat-link-member'>member</div>
                  <div>{profile.name}</div>
                </div>

                <div className='ellipsis font-6'>
                  {profile.email} ({profile.id})
                </div>
              </div>

              <div className='flex responsive justify-center items-center'>
                <div className='flex column items-center justify-center'>
                  <div className='text-color font-10'>
                    {user_stats?.win || 0.0}
                  </div>
                  <div>WIN</div>
                </div>

                <div className='bg-main-transparent rounded-full b-m2 p-3 ml-2 mr-2 flex justify-center items-center text-bold font-8'>
                  <div className='absolute'>-</div>
                </div>

                <div className='flex column items-center justify-center'>
                  <div className='text-color font-10'>
                    {user_stats?.bet || 0.0}
                  </div>
                  <div>BET</div>
                </div>

                <div className='bg-main-transparent rounded-full b-m2 p-3 ml-2 mr-2 flex justify-center items-center text-bold font-8'>
                  <div className='absolute'>=</div>
                </div>

                <div className='flex column items-center justify-center'>
                  <div className='text-color font-10'>
                    {(parseFloat(user_stats?.win) -
                      parseFloat(user_stats?.bet)).toFixed(2) || 0.0}
                  </div>
                  <div>PROFIT</div>
                </div>
              </div>
            </div>

            <div className='bg-light-transparent rounded-1 b-l2 p-2'>
              <div className='text-left'>
                <div className='font-12'>
                  {profile.name} is level {userData.level?.level || 'Unknown'}.
                </div>

                <div className='font-8'>
                  {profile.name} has {userData.level?.have} /{' '}
                  {userData.level?.next} xp needed for the next level.
                </div>

                <div className='font-8'>
                  Completion:{' '}
                  {(
                    (userData.level?.have / userData.level?.next) *
                    100
                  ).toFixed(2)}
                  %
                </div>
              </div>

              <div className='progress-container small width-full rounded-0 mt-2'>
                <div
                  className='progress-bar rounded-0'
                  style={{
                    width: `${(userData.level?.have / userData.level?.next) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className='grid split-column-2 responsive gap-1'>
            <div className='bg-light-transparent rounded-1 b-l2 p-2'>
              <div className='title-page flex items-center justify-center mb-2'>
                Profile Overview
              </div>

              <div className='text-left font-8'>
                Registered on:{' '}
                {new Date(
                  Number(userData.profile?.time_create) * 1000
                ).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className='table-container'>
              <div className='table-header'>
                <div className='table-row'>
                  <div className='table-column text-left'>Device</div>
                  <div className='table-column text-left'>Browser</div>
                  <div className='table-column text-left'>Location</div>
                  <div className='table-column text-left'>Date</div>
                </div>
              </div>

              <div className='table-body'>
                {profile.devices?.map((device: any, idx: number) => (
                  <div key={idx} className='table-row'>
                    <div className='table-column text-left'>{device.name}</div>
                    <div className='table-column text-left'>
                      {device.browser}
                    </div>
                    <div className='table-column text-left'>
                      {device.location}
                    </div>
                    <div className='table-column text-left'>{device.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='switch_content'>
          <p>Game stats dynamically updated</p>
        </div>
      )}
    </>
  );
};

export default page;
