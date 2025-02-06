'use client'; // Ensure this file is treated as a client-side component

import { useEffect, useState } from 'react';
import DepositContent from '@/components/sections/deposit/content';
import { SiteSetting } from '@/lib/client/types';

const Page = () => {
  const [restricted, setRestricted] = useState<boolean>(true);

  useEffect(() => {
    // Check if localStorage is available and retrieve the item
    const item = localStorage.getItem('siteSettings'); // Replace 'yourKey' with the actual key
    const jsonData = JSON.parse(item ? item : '');
    setRestricted(
      jsonData.findIndex(
        (v: SiteSetting) => v.key === 'deposit' && v.value === 'true'
      ) == -1
    );
  }, []); // Empty dependency array to run only once on mount
  console.log(restricted);

  return (
    <div>
      {restricted ? 'This page is not available for now' : <DepositContent />}
    </div>
  );
};

export default Page;
