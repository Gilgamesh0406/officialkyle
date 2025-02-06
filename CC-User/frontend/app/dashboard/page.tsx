'use client';

import Games from '@/components/pages/dashboard/Games.';
import Summary from '@/components/pages/dashboard/Summary';
import { useState } from 'react';

const page = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <>
      <div className='grid split-column-full responsive gap-1 mb-2'>
        <button
          onClick={() => setActiveTab(1)}
          className='site-button black dashboard-load switch_panel active'
          data-id='dashboard'
          data-panel='summary'
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className='site-button black dashboard-load switch_panel'
          data-id='dashboard'
          data-panel='games'
        >
          Games
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className='site-button black dashboard-load switch_panel'
          data-id='dashboard'
          data-panel='offers'
        >
          Offers
        </button>
      </div>

      {activeTab === 1 ? <Summary /> : activeTab === 2 ? <Games /> : null}
    </>
  );
};

export default page;
