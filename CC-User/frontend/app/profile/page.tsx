'use client';
import CryptoTransactionsTable from '@/components/pages/profile/CryptoTransactionsTable';
import DepositWithdrawStatsTable from '@/components/pages/profile/DepositWithdrawStatsTable';
import GameStatsTable from '@/components/pages/profile/GameStatsTable';
import P2PTransactionsTable from '@/components/pages/profile/P2PTransactionsTable';
import ProfileTabOne from '@/components/pages/profile/ProfileTabOne';
import ProfileTabs from '@/components/pages/profile/ProfileTabs';
import SteamTransactionsTable from '@/components/pages/profile/SteamTransactionsTable';
import UserTransfersTable from '@/components/pages/profile/UserTransferTable';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const page = ({ searchParams }: { searchParams: { tab?: string } }) => {
  const tab = parseInt(searchParams.tab || '1', 10);
  const [userData, setUserData] = useState<any>();

  const fetchData = React.useCallback(async () => {
    console.log("tab", tab)
    const response = await axios.get(`/api/profile?tab=${tab}`);
    setUserData(response.data);
  }, [tab]);
  useEffect(() => {
    fetchData();
  }, [tab]);

  const onChangeProfileData = (key: string, value: any) => {
    switch (key) {
      case 'privateMode':
        setUserData({
          ...userData,
          profile: {
            ...userData.profile,
            private: value,
          },
        });
        break;
      case 'sounds':
        setUserData({
          ...userData,
          sounds: value,
        });
        break;
      default:
        setUserData({
          ...userData,
          profile: {
            ...userData.profile,
            [key]: value,
          },
        });
        break;
    }
  };
  const renderTabContent = () => {
    switch (tab) {
      case 1:
        return (
          <ProfileTabOne
            userData={userData}
            onChangeProfileData={onChangeProfileData}
          />
        );
      case 2:
        return (
          <SteamTransactionsTable
            currentPage={1}
            onPageChange={() => {}}
            totalPages={12}
            transactions={[
              {
                amount: '12',
                code: '123456',
                date: '2023-01-01 12:00:00',
                game: 'CSGO',
                id: '1',
                status: 'Pending',
                tradeId: '123456',
                type: 'Deposit',
              },
            ]}
          />
        );
      case 3:
        return (
          <P2PTransactionsTable
            currentPage={1}
            onPageChange={() => {}}
            totalPages={12}
            transactions={[
              {
                amount: '123',
                date: '2023-01-01 12:00:00',
                game: 'CSGO',
                id: '1',
                status: 'Pending',
                type: 'Deposit',
                tradeId: '123456',
              },
            ]}
          />
        );
      case 4:
        return (
          <CryptoTransactionsTable
            currentPage={1}
            onPageChange={() => {}}
            totalPages={12}
            transactions={[]}
          />
        );
      case 5:
        return (
          <CryptoTransactionsTable
            currentPage={1}
            onPageChange={() => {}}
            totalPages={12}
            transactions={[]}
          />
        );
      case 6:
        return (
          <UserTransfersTable
            currentPage={1}
            onPageChange={() => {}}
            totalPages={12}
            transfers={[]}
          />
        );
      case 7:
        return (
          <div className='flex responsive gap-1'>
            <div className='width-6 responsive text-left'>
              <div className='text-color mb-1 font-8'>Games Stats</div>
              <GameStatsTable
                stats={[
                  {
                    game: 'CSGO',
                    bets: '123',
                    id: '123',
                    profit: '123',
                    wins: '123',
                  },
                ]}
              />
            </div>
            <div className='width-6 responsive text-left'>
              <div className='text-color mb-1 font-8'>Offers stats</div>
              <DepositWithdrawStatsTable
                stats={[
                  {
                    id: '123',
                    count: 123,
                    offer: '123',
                    total: 123,
                  },
                ]}
              />
            </div>
          </div>
        );
      // ... other cases
      default:
        return null;
    }
  };
  if (!userData?.profile) {
    return <div>Loading data...</div>;
  }
  return (
    <div className='p-2'>
      <ProfileTabs activeTab={tab} />
      <div className={`switch_content`}>{renderTabContent()}</div>
    </div>
  );
};

export default page;
