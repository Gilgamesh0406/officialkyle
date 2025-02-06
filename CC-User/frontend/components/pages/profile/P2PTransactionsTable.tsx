import React from 'react';
import CommonTable from '@/components/ui/TableComponent';

interface Transaction {
  id: string;
  tradeId: string;
  amount: string;
  type: string;
  game: string;
  status: string;
  date: string;
}

interface P2PTransactionsTableProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const P2PTransactionsTable: React.FC<P2PTransactionsTableProps> = ({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const columns = [
    { key: 'id', label: 'Id' },
    { key: 'tradeId', label: 'Trade Id' },
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
      tableId='p2p_transactions'
    />
  );
};

export default P2PTransactionsTable;
