import React from 'react';
import Input from '@/components/ui/Input';

type FormData = {
  searchCase: string;
  players: string;
  orderBy: string;
};

type SearchCaseProps = {
  formData: FormData;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (e: any) => void;
};

const BattleCaseSearch: React.FC<SearchCaseProps> = ({
  formData,
  onInput,
  onSelect,
}) => {
  return (
    <div className='relative z-10 flex row responsive items-center gap-1'>
      <div className='input_field transition-5' data-border='#de4c41'>
        <Input
          label='Search Case'
          name='searchCase'
          value={formData.searchCase}
          onInput={onInput}
        />
        <div className='field_bottom'></div>
      </div>

      <div className='dropdown_field transition-5'>
        <Input
          label='Players'
          name='players'
          value={formData.players}
          onSelect={onSelect}
          activeVal={formData.players}
          dropdownData={[
            { value: 'All' },
            { value: '2' },
            { value: '3' },
            { value: '4' },
          ]}
        />
        <div className='field_bottom'></div>
      </div>

      <div className='dropdown_field transition-5'>
        <Input
          label='Order by'
          name='orderBy'
          value={formData.orderBy}
          onSelect={onSelect}
          activeVal={formData.orderBy}
          dropdownData={[
            { value: 'Latest' },
            { value: 'Amount ascending' },
            { value: 'Amount descending' },
          ]}
        />
        <div className='field_bottom'></div>
      </div>
    </div>
  );
};

export default BattleCaseSearch;
