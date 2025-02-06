import React from 'react';
import CommonTable from '@/components/ui/TableComponent';

interface Transaction {
  id: string;
  txnId: string;
  amount: string;
  type: string;
  currency: string;
  status: string;
  date: string;
}

interface CryptoTransactionsTableProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CryptoTransactionsTable: React.FC<CryptoTransactionsTableProps> = ({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const columns = [
    { key: 'id', label: 'Id' },
    { key: 'txnId', label: 'TXN Id' },
    { key: 'amount', label: 'Amount' },
    { key: 'type', label: 'Type' },
    { key: 'currency', label: 'Currency' },
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
      tableId='crypto_transactions'
    />
  );
};

export default CryptoTransactionsTable;
