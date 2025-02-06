import React from 'react';

interface Column {
  key: string;
  label: string;
}

interface Record {
  id: string;
  [key: string]: string | number | boolean;
}

interface FooterData {
  [key: string]: string | number | React.ReactNode;
}

interface CommonTableProps {
  columns: Column[];
  records: any[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  tableId: string;
  footerData?: FooterData;
}

const CommonTable: React.FC<CommonTableProps> = ({
  columns,
  records,
  currentPage,
  totalPages,
  onPageChange,
  tableId,
  footerData,
}) => {
  return (
    <div className='table-container'>
      <div className='table-header'>
        <div className='table-row'>
          {columns.map((column) => (
            <div key={column.key} className='table-column text-left'>
              {column.label}
            </div>
          ))}
        </div>
      </div>
      <div className='table-body' id={tableId}>
        {records.length > 0 ? (
          records.map((record) => (
            <div
              key={record.id}
              className={`table-row ${record.isPositive ? 'text-success' : record.isNegative ? 'text-danger' : ''}`}
            >
              {columns.map((column) => (
                <div key={column.key} className='table-column text-left'>
                  {record[column.key]}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className='table-row'>
            <div className='table-column'>No data found</div>
          </div>
        )}
      </div>
      {footerData && (
        <div className='table-footer'>
          <div className='table-row'>
            {columns.map((column) => (
              <div key={column.key} className='table-column text-left'>
                {footerData[column.key]}
              </div>
            ))}
          </div>
        </div>
      )}
      {currentPage && totalPages && onPageChange && (
        <div className='table-footer'>
          <div className='flex items-center justify-center bg-dark p-2'>
            <div
              className='pagination-content flex row gap-2'
              id={`pagination_${tableId}`}
            >
              <div
                className='pagination-item flex items-center justify-center'
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              >
                «
              </div>
              <div className='flex row gap-1'>
                {[...Array(totalPages)].map((_, index) => (
                  <div
                    key={index}
                    className={`pagination-item flex items-center justify-center ${
                      currentPage === index + 1 ? 'active' : ''
                    }`}
                    onClick={() => onPageChange(index + 1)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div
                className='pagination-item flex items-center justify-center'
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                »
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonTable;
