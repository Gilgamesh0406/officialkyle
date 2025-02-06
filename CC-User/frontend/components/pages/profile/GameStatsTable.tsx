import React from 'react';
import CommonTable from '../../ui/TableComponent';

interface GameStat {
  id: string;
  game: string;
  bets: string;
  wins: string;
  profit: string;
}

interface GameStatsTableProps {
  stats: GameStat[];
}

const GameStatsTable: React.FC<GameStatsTableProps> = ({ stats }) => {
  const columns = [
    { key: 'game', label: 'Game' },
    { key: 'bets', label: 'Bets' },
    { key: 'wins', label: 'Wins' },
    { key: 'profit', label: 'Profit' },
  ];

  const footerData = {
    game: 'Total:',
    bets: (
      <div className='flex'>
        33.45
        <img style={{ height: 25 }} src='/imgs/coins.webp' alt='Coins' />
      </div>
    ),
    wins: (
      <div className='flex'>
        0.33
        <img style={{ height: 25 }} src='/imgs/coins.webp' alt='Coins' />
      </div>
    ),
    profit: (
      <div className='flex'>
        -33.12
        <img style={{ height: 25 }} src='/imgs/coins.webp' alt='Coins' />
      </div>
    ),
  };

  return (
    <CommonTable
      columns={columns}
      records={stats}
      tableId='game_stats'
      footerData={footerData}
    />
  );
};

export default GameStatsTable;
