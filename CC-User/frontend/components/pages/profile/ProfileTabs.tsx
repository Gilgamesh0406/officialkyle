import Link from 'next/link';
import React from 'react';

interface ProfileTabsProps {
  activeTab: number;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab }) => {
  const tabs = [
    { id: 1, name: 'Summary', panel: 'summary' },
    { id: 2, name: 'Steam Offers', panel: 'steam_offers' },
    { id: 3, name: 'P2P Offers', panel: 'p2p_offers' },
    { id: 4, name: 'Crypto Offers', panel: 'crypto_offers' },
    { id: 5, name: 'Transactions', panel: 'transactions' },
    { id: 6, name: 'Transfers', panel: 'transfers' },
    { id: 7, name: 'Stats', panel: 'stats' },
  ];

  return (
    <div className='grid split-column-full responsive gap-1 mb-2'>
      {tabs.map((tab) => (
        <Link
          href={`/profile?tab=${tab.id}`}
          key={tab.id}
          className={`site-button black switch_panel ${activeTab === tab.id ? 'active' : ''}`}
        >
          <button data-id='profile' data-panel={tab.panel} style={{ top: 0 }}>
            {tab.name}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default ProfileTabs;
