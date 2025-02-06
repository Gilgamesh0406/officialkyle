import React from 'react';

type Props = {};

function RainPanel({}: Props) {
  return (
    <div className='rain_panel p-3 hidden'>
      <div className='title-page flex items-center justify-center text-center'>
        WERE REFUELING
      </div>

      <div className='rainJoin hidden'>
        <div className='text-center font-8'>
          Join to claim some free diesel!
        </div>

        <div className='text-center'>
          <button type='button' className='site-button purple' id='join_rain'>
            JOIN
          </button>
        </div>
      </div>

      <div className='rainJoined hidden'>
        <div className='text-center font-8'>
          You have successfully joined the refuel! You will receive your diesel
          as soon as the refuel is over.
        </div>
      </div>

      <div className='rainWait hidden'>
        <div className='text-center font-8'>
          The time to enter to refuel has elapsed. You can enter the next
          refuel.
        </div>
      </div>
    </div>
  );
}

export default RainPanel;
