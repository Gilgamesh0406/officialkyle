import React from 'react';
import CommonTable from '../../ui/TableComponent';

interface Transfer {
  id: string;
  from: string;
  to: string;
  amount: string;
  date: string;
}

interface UserTransfersTableProps {
  transfers: Transfer[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserTransfersTable: React.FC<UserTransfersTableProps> = ({
  transfers,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const columns = [
    { key: 'id', label: 'Id' },
    { key: 'from', label: 'From' },
    { key: 'to', label: 'To' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <CommonTable
      columns={columns}
      records={transfers}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      tableId='user_transfers'
    />
  );
};

export default UserTransfersTable;
