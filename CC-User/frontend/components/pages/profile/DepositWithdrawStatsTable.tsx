import React from 'react';
import CommonTable from '../../ui/TableComponent';

interface OfferStat {
  id: string;
  offer: string;
  count: number;
  total: number;
}

interface DepositWithdrawStatsTableProps {
  stats: OfferStat[];
}

const DepositWithdrawStatsTable: React.FC<DepositWithdrawStatsTableProps> = ({
  stats,
}) => {
  const columns = [
    { key: 'offer', label: 'Offer' },
    { key: 'count', label: 'Count' },
    { key: 'total', label: 'Total' },
  ];

  const formattedStats = stats.map((stat) => ({
    ...stat,
    total: (
      <div className='flex'>
        {stat.total.toFixed(2)}
        <img style={{ height: 25 }} src='/imgs/coins.webp' alt='Coins' />
      </div>
    ),
  }));

  return (
    <CommonTable
      columns={columns}
      records={formattedStats}
      tableId='deposit_withdraw_stats'
    />
  );
};

export default DepositWithdrawStatsTable;
