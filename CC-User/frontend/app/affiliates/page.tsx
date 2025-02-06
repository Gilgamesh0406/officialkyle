import React from 'react';

const page = () => {
  return (
    <div className='flex gap-2 responsive'>
      <div className='width-3 responsive'>
        <div className='flex column gap-2'>
          <div className='table-container'>
            <div className='table-header'>
              <div className='table-row'>
                <div className='table-column text-left'>Tier</div>
                <div className='table-column text-left'>Requirements</div>
                <div className='table-column text-left'>Deposit</div>
              </div>
            </div>

            <div className='table-body'>
              <div className='table-row'>
                <div className='table-column text-left'>1</div>
                <div className='table-column text-left'>0.00</div>
                <div className='table-column text-left'>0.75%</div>
              </div>
              <div className='table-row'>
                <div className='table-column text-left'>2</div>
                <div className='table-column text-left'>100.00</div>
                <div className='table-column text-left'>1.50%</div>
              </div>
              <div className='table-row'>
                <div className='table-column text-left'>3</div>
                <div className='table-column text-left'>500.00</div>
                <div className='table-column text-left'>2.25%</div>
              </div>
              <div className='table-row'>
                <div className='table-column text-left'>4</div>
                <div className='table-column text-left'>1000.00</div>
                <div className='table-column text-left'>3.00%</div>
              </div>
              <div className='table-row'>
                <div className='table-column text-left'>5</div>
                <div className='table-column text-left'>2500.00</div>
                <div className='table-column text-left'>3.75%</div>
              </div>
              <div className='table-row'>
                <div className='table-column text-left'>6</div>
                <div className='table-column text-left'>5000.00</div>
                <div className='table-column text-left'>4.50%</div>
              </div>
            </div>
          </div>

          <div className='flex column gap-1 bg-light-transparent b-d2 p-2 rounded-1'>
            <div className='flex justify-between font-6'>
              <div className='text-upper text-bold text-gray'>Progress</div>
              <div>0.00 / 100.00</div>
            </div>

            <div
              className='progress-container small width-full rounded-0'
              title='Progress: 0.00%'
            >
              <div className='progress-bar rounded-0'></div>
              <div className='progress-content pl-2 flex justify-start items-center'>
                Tier 1
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='width-9 responsive'>
        <div className='flex column gap-2'>
          <div className='bg-dark-transparent b-d2 p-2 rounded-1 grid split-column-1 gap-2'>
            <div className='flex column items-center justify-center'>
              <div className='text-upper font-9'>4.50% deposit commission!</div>
              <div className='text-color font-7'>
                Get diesel when friends deposit!
              </div>
            </div>
          </div>

          <div className='grid split-column-3 gap-2 responsive'>
            <div className='flex justify-between bg-light b-d2 p-2 rounded-1'>
              <div className='flex column gap-1 text-left'>
                <div className='text-upper text-bold text-gray font-6'>
                  Deposit commission
                </div>
                <div className='font-8'>
                  <div className='coins mr-1'></div>0.00000
                </div>
              </div>
            </div>
            <div className='flex justify-between bg-light b-d2 p-2 rounded-1'>
              <div className='flex column gap-1 text-left'>
                <div className='text-upper text-bold text-gray font-6'>
                  Collected
                </div>
                <div className='font-8'>
                  <div className='coins mr-1'></div>0.00
                </div>
              </div>
            </div>
            <div className='flex justify-between bg-light b-d2 p-2 rounded-1'>
              <div className='flex column gap-1 text-left'>
                <div className='text-upper text-bold text-gray font-6'>
                  Available
                </div>
                <div className='font-8'>
                  <div className='coins mr-1'></div>0.00000
                </div>
              </div>

              <button
                className='site-button purple'
                id='collect_affiliates_referral_available'
              >
                Collect
              </button>
            </div>
          </div>

          <div className='table-container'>
            <div className='table-header'>
              <div className='table-row'>
                <div className='table-column text-left'>User Id</div>
                <div className='table-column text-left'>Wagered</div>
                <div className='table-column text-left'>Deposited</div>
                <div className='table-column text-left'>
                  Commission deposited
                </div>
                <div className='table-column text-left'>Total</div>
              </div>
            </div>

            <div className='table-body'>
              <div className='table-row'>
                <div className='table-column'>No data found</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
