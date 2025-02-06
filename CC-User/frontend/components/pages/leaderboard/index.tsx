'use client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface LeaderboardUser {
  userid: string;
  username: string;
  xp: number;
  total_played: number;
  total_amount: number;
}

const UserNameLink = ({
  username,
  userid,
}: {
  username: string;
  userid: string;
}) => (
  <Link
    href={`/profile/${userid}`}
    className='hover:text-primary transition-colors duration-200'
  >
    {username}
  </Link>
);

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    axios.get(`/api/leaderboard?period=${period}`).then((res) => {
      setLeaderboard(res.data);
    });
  }, [period]);

  const periods = [
    { value: 'today', label: 'TODAY' },
    { value: 'week', label: 'WEEK' },
    { value: 'month', label: 'MONTH' },
  ] as const;

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-500/50 font-bold text-yellow-100';
      case 1:
        return 'bg-gray-300/50 font-bold text-gray-100';
      case 2:
        return 'bg-amber-700/50 font-bold text-amber-100';
      default:
        return '';
    }
  };

  return (
    <div className='p-4 max-w-6xl mx-auto'>
      {/* Title Section */}
      <div className='relative mb-12'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-800/50'></div>
        </div>
        <div className='relative flex justify-center'>
          <div className='bg-[#0F1923] px-8 py-2'>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-white'>
              LEADERBOARD
            </h1>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className='flex justify-center gap-2 mb-12 bg-gray-900/80 p-1.5 rounded-lg backdrop-blur-sm w-fit mx-auto shadow-lg'>
        {periods.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={`px-5 py-2 rounded-md font-semibold text-sm transition-all duration-200
              ${
                period === value
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Top 3 Section */}
      <div className='flex justify-center items-end gap-4 mb-12'>
        {/* Second Place */}
        {leaderboard[1] && (
          <div
            className={`text-center p-6 rounded-xl ${getRankStyle(1)} transform hover:scale-105 transition-transform duration-200 w-64`}
          >
            <div className='text-4xl mb-3'>🥈</div>
            <div className='font-bold text-xl mb-2'>
              <UserNameLink
                username={leaderboard[1].username}
                userid={leaderboard[1].userid}
              />
            </div>
            <div className='text-sm opacity-90 mb-2'>
              Games: {leaderboard[1].total_played}
            </div>
            <div className='flex items-center justify-center gap-2 text-lg'>
              <div className='coins w-5 h-5' />
              {Math.round(leaderboard[1].total_amount * 100) / 100}
            </div>
          </div>
        )}

        {/* First Place */}
        {leaderboard[0] && (
          <div
            className={`text-center p-8 rounded-xl ${getRankStyle(0)} transform hover:scale-105 transition-transform duration-200 w-72 -mt-8`}
          >
            <div className='text-5xl mb-4'>👑</div>
            <div className='font-bold text-2xl mb-2'>
              <UserNameLink
                username={leaderboard[0].username}
                userid={leaderboard[0].userid}
              />
            </div>
            <div className='text-sm opacity-90 mb-2'>
              Games: {leaderboard[0].total_played}
            </div>
            <div className='flex items-center justify-center gap-2 text-xl'>
              <div className='coins w-6 h-6' />
              {Math.round(leaderboard[0].total_amount * 100) / 100}
            </div>
          </div>
        )}

        {/* Third Place */}
        {leaderboard[2] && (
          <div
            className={`text-center p-6 rounded-xl ${getRankStyle(2)} transform hover:scale-105 transition-transform duration-200 w-64`}
          >
            <div className='text-4xl mb-3'>🥉</div>
            <div className='font-bold text-xl mb-2'>
              <UserNameLink
                username={leaderboard[2].username}
                userid={leaderboard[2].userid}
              />
            </div>
            <div className='text-sm opacity-90 mb-2'>
              Games: {leaderboard[2].total_played}
            </div>
            <div className='flex items-center justify-center gap-2 text-lg'>
              <div className='coins w-5 h-5' />
              {Math.round(leaderboard[2].total_amount * 100) / 100}
            </div>
          </div>
        )}
      </div>

      {/* Table for remaining users */}
      <div className='table-container bg-secondary/50 rounded-xl overflow-hidden shadow-xl'>
        <div className='table-header bg-primary/20 text-gray-300'>
          <div className='table-row p-4 font-bold'>
            <div className='table-column text-left'>Rank</div>
            <div className='table-column text-left'>User</div>
            <div className='table-column text-left'>Games played</div>
            <div className='table-column text-left'>Total winnings</div>
          </div>
        </div>

        <div className='table-body'>
          {leaderboard.slice(3).map((user, index) => (
            <div
              key={user.userid}
              className='table-row p-4 hover:bg-primary/10 transition-colors border-t border-gray-700/30'
            >
              <div className='table-column text-left text-gray-400'>
                #{index + 4}
              </div>
              <div className='table-column text-left font-medium'>
                <UserNameLink username={user.username} userid={user.userid} />
              </div>
              <div className='table-column text-left text-gray-300'>
                {user.total_played}
              </div>
              <div className='table-column text-left flex items-center gap-2'>
                <div className='coins w-4 h-4' />
                <span className='text-primary-light'>
                  {Math.round(user.total_amount * 100) / 100}
                </span>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className='table-row p-8'>
              <div className='table-column text-center text-gray-400 text-lg'>
                No players have bet on the site!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
