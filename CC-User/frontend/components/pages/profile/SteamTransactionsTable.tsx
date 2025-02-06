import React from 'react';
import CommonTable from '@/components/ui/TableComponent';

interface Transaction {
  id: string;
  tradeId: string;
  code: string;
  amount: string;
  type: string;
  game: string;
  status: string;
  date: string;
}

interface SteamTransactionsTableProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SteamTransactionsTable: React.FC<SteamTransactionsTableProps> = ({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const columns = [
    { key: 'id', label: 'Id' },
    { key: 'tradeId', label: 'Trade Id' },
    { key: 'code', label: 'Code' },
    { key: 'amount', label: 'Amount' },
    { key: 'type', label: 'Type' },
    { key: 'game', label: 'Game' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <CommonTable
      columns={columns}
      records={transactions}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      tableId='steam_transactions'
    />
  );
};

export default SteamTransactionsTable;
