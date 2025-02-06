import React from 'react';
import { TransitionGroup } from 'react-transition-group';

type Props = {
  history: any;
};

const PlinkoHistory = ({ history }: Props) => {
  return (
    <div className='table-container w-full'>
      <div className='table-header'>
        <div className='table-row'>
          <div className='table-column text-left'>User</div>
          <div className='table-column text-left'>Bet</div>
          <div className='table-column text-left'>Multiplier</div>
          <div className='table-column text-left'>Game</div>
          <div className='table-column text-left'>Roll</div>
          <div className='table-column text-left'>Profit</div>
        </div>
      </div>

      <div className='table-body' id='plinko_history'>
        {history.length === 0 ? (
          <div className='table-row history_message'>
            <div className='table-column'>No data found</div>
          </div>
        ) : (
          <TransitionGroup component={null}>{history}</TransitionGroup>
        )}
      </div>
    </div>
  );
};

export default PlinkoHistory;
