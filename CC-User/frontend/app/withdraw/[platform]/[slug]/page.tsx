import WithdrawCryptoContent from '@/components/pages/withdraw/WithdrawCryptoContent';
import WithdrawSteamContent from '@/components/pages/withdraw/WithdrawSteamContent';

const page = ({ params }: { params: { platform: string; slug: string } }) => {
  const { platform } = params;

  return platform === 'crypto' ? (
    <WithdrawCryptoContent />
  ) : (
    <WithdrawSteamContent />
  );
};

export default page;
