'use client'; // Ensure this file is treated as a client-side component
import DepositSteamContent from '@/components/pages/deposit/DepositContent';
import DepositCryptoContent from '@/components/pages/deposit/DepositCryptoContent';
import DepositRealMoneyContent from '@/components/pages/deposit/DepositRealMoneyContent';
import { SiteSetting } from '@/lib/client/types';
import { useEffect, useState } from 'react';

const Page = ({ params }: { params: { platform: string; slug: string } }) => {
  const { platform, slug } = params;
  const [restricted, setRestricted] = useState<boolean>(true);

  useEffect(() => {
    // Check if localStorage is available and retrieve the item
    const item = localStorage.getItem('siteSettings'); // Replace 'yourKey' with the actual key
    const jsonData = JSON.parse(item ? item : '');
    setRestricted(
      (jsonData.findIndex(
        (v: SiteSetting) =>
          v.key === 'deposit_crypto_currency' && v.value === 'true'
      ) == -1 &&
        platform === 'crypto') ||
        (jsonData.findIndex(
          (v: SiteSetting) =>
            v.key === 'deposit_real_money' && v.value === 'true'
        ) == -1 &&
          platform === 'realmoney') ||
        (jsonData.findIndex(
          (v: SiteSetting) => v.key === 'deposit_steam' && v.value === 'true'
        ) == -1 &&
          platform === 'steam')
    );
  }, []); // Empty dependency array to run only once on mount

  return restricted ? (
    'This page is not available for now'
  ) : platform === 'crypto' ? (
    <DepositCryptoContent slug={slug} />
  ) : platform === 'realmoney' ? (
    <DepositRealMoneyContent slug={slug} />
  ) : (
    <DepositSteamContent />
  );
};

export default Page;
