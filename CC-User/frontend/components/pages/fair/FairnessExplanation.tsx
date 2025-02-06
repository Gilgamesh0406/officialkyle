import React from 'react';

const FairnessExplanation: React.FC = () => {
  return (
    <div>
      <div className='text-bold mt-2 mb-1'>
        Select a game from the list below to learn about how we ensure that the
        results are always random and never tampered with.
      </div>
      <div>
        Crazycargo.gg uses a provably fair method that doesn't allow us to
        manipulate the outcome once the game is started. Below, you can see how
        the outputs are calculated.
      </div>
      <div>
        You can execute the code straight from your browser with tools such as{' '}
        <a
          className='text-color'
          href='https://www.tutorialspoint.com/execute_nodejs_online.php'
          target='_blank'
          rel='noopener noreferrer'
        >
          this NodeJS tester
        </a>
        . Simply replace all parameters with the ones in the round you want to
        check.
      </div>
    </div>
  );
};

export default FairnessExplanation;
