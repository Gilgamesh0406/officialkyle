import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

interface CaseItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  count: number;
  onCountChange: (newCount: number) => void;
  active: boolean;
}

const CaseItem: React.FC<CaseItemProps> = React.memo(
  ({ id, name, price, image, count, onCountChange, active }) => {
    const handleCountChange = (increment: number) => {
      onCountChange(increment);
    };

    return (
      <div
        className={`case-item casebattle_item flex column gap-1 ${count > 0 && active ? 'active' : ''}`}
        data-id={id}
        data-count={count}
        data-name={name}
        data-price={price}
        data-item={JSON.stringify({ id, name, image, price })}
      >
        <div className='case-slot rounded-0'>
          <div className='case-image-content flex items-center justify-center p-2'>
            <img
              className='case-image transition-5'
              src={`/imgs/cases/${image}`}
              alt={name}
            />
          </div>
          <div className='case-name-content text-left ellipsis'>{name}</div>
          <div className='case-price text-left'>
            <div className='coins mr-1'></div>
            {price.toFixed(2)}
          </div>
        </div>
        <div className='bg-light-transparent rounded-1 flex row justify-between items-center gap-2 p-2'>
          <button
            className='site-button black casebattle_add_more'
            onClick={() => handleCountChange(-1)}
            disabled={count === 0}
            aria-label='Decrease count'
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <div className='font-8 text-bold casebattle_add_count'>{count}</div>
          <button
            className='site-button black casebattle_add_more'
            onClick={() => handleCountChange(1)}
            aria-label='Increase count'
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
    );
  }
);

export default CaseItem;
