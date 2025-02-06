'use client';
import Input from '@/components/ui/Input';
import React, { ChangeEvent, useState } from 'react';

const page = () => {
  const [bonusCodeVal, setbonusCodeVal] = useState('');
  const [createCodeVal, setcreateCodeVal] = useState('');
  const [refferalCodeVal, setrefferalCodeVal] = useState('');

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'bonus-code') setbonusCodeVal(value);
    if (name === 'create-code') setcreateCodeVal(value);
    if (name === 'refferal-code') setrefferalCodeVal(value);
  };
  return (
    <div className='flex responsive column gap-1'>
      <div className='grid responsive split-column-3 gap-1'>
        <div className='bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column justify-between height-full'>
            <div className='text-bold font-8'>Connect</div>

            <div className='mt-2 mb-2'>
              <div className='flex justify-center items-center gap-1'>
                <div className='social-login steam icon-large rounded-full flex justify-center items-center'></div>

                <div className='text-left text-gray'>
                  <div>
                    Link your <span className='text-color'>Steam</span> to your
                    account
                  </div>
                  <div>
                    And receive <span className='text-color'>0.15 diesel</span>
                  </div>
                </div>
              </div>
            </div>

            <a href='/auth/steam?assign=1&amp;return=rewards'>
              <button className='site-button purple width-full'>Connect</button>
            </a>
          </div>
        </div>

        <div className='bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column justify-between height-full'>
            <div className='text-bold font-8'>Connect</div>

            <div className='mt-2 mb-2'>
              <div className='flex justify-center items-center gap-1'>
                <div className='social-login google icon-large rounded-full flex justify-center items-center'></div>

                <div className='text-left text-gray'>
                  <div>
                    Link your <span className='text-color'>Google</span> to your
                    account
                  </div>
                  <div>
                    And receive <span className='text-color'>0.15 diesel</span>
                  </div>
                </div>
              </div>
            </div>

            <a href='/auth/google?assign=1&amp;return=rewards'>
              <button className='site-button purple width-full'>Connect</button>
            </a>
          </div>
        </div>

        <div className='bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column justify-between height-full'>
            <div className='text-bold font-8'>Connect</div>

            <div className='mt-2 mb-2'>
              <div className='flex justify-center items-center gap-1'>
                <div className='social-login discord icon-large rounded-full flex justify-center items-center'></div>

                <div className='text-left text-gray'>
                  <div>
                    Link your <span className='text-color'>Discord</span> to
                    your account
                  </div>
                  <div>
                    And receive <span className='text-color'>0.15 diesel</span>
                  </div>
                </div>
              </div>
            </div>

            <a href='/auth/discord?assign=1&amp;return=rewards'>
              <button className='site-button purple width-full'>Connect</button>
            </a>
          </div>
        </div>
      </div>

      <div className='grid responsive split-column-3 gap-1'>
        <div className='bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column justify-between height-full'>
            <div className='text-bold font-8'>Daily gift</div>

            <div className='text-gray mt-2 mb-2'>
              <div>
                Deposit at least{' '}
                <span className='text-color'>10.00 diesel</span> in the last{' '}
                <span className='text-color'>14 days</span> to earn up to{' '}
                <span className='text-color'>2.20 diesel</span> daily
              </div>
              <div>
                The amount is based by your level. The amount starts from{' '}
                <span className='text-color'>0.20 diesel</span> and each level
                increase with <span className='text-color'>0.02 diesel</span>
              </div>
            </div>

            <button
              className='site-button purple width-full'
              id='collect_reward_daily'
            >
              Collect
            </button>
          </div>
        </div>

        <div className='bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column justify-between height-full'>
            <div className='text-bold font-8'>Referral code</div>

            <div className='mt-2 mb-2'>
              <div className='text-gray mb-2'>
                Use any referral code and receive{' '}
                <span className='text-color'>0.20 diesel</span>
              </div>

              <div
                className='input_field bet_input_field transition'
                data-border='#de4c41'
              >
                <Input
                  label='Refferal Code'
                  name='refferal-code'
                  value={refferalCodeVal}
                  onInput={onInput}
                />

                <div className='field_bottom'>
                  <div
                    className='field_error'
                    data-error='minimum_6_characters'
                  >
                    This field must be a text with minimum 6 characters
                  </div>
                  <div
                    className='field_error'
                    data-error='only_letters_numbers'
                  >
                    This field must contain only letters and numbers
                  </div>
                </div>
              </div>
            </div>

            <button
              className='site-button purple width-full'
              id='collect_reward_referral_redeem'
            >
              Collect
            </button>
          </div>
        </div>

        <div className='bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column justify-between height-full'>
            <div className='text-bold font-8'>Create referral code</div>

            <div className='mt-2 mb-2'>
              <div className='text-gray'>
                Create and share your referral code to give{' '}
                <span className='text-color'>0.20 diesel</span>
              </div>

              <div
                className='input_field bet_input_field transition'
                data-border='#de4c41'
              >
                <Input
                  label='Create Code'
                  name='create-code'
                  value={createCodeVal}
                  onInput={onInput}
                />

                <div className='field_bottom'>
                  <div
                    className='field_error'
                    data-error='minimum_6_characters'
                  >
                    This field must be a text with minimum 6 characters
                  </div>
                  <div
                    className='field_error'
                    data-error='only_letters_numbers'
                  >
                    This field must contain only letters and numbers
                  </div>
                </div>
              </div>
            </div>

            <button
              className='site-button purple width-full'
              id='collect_reward_referral_create'
            >
              Create
            </button>
          </div>
        </div>
      </div>

      <div className='grid responsive split-column-3 gap-1'>
        <div className='bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column justify-between height-full'>
            <div className='text-bold font-8'>Bonus code</div>

            <div className='mt-2 mb-2'>
              <div
                className='input_field bet_input_field transition'
                data-border='#de4c41'
              >
                <Input
                  label='Bonus Code'
                  name='bonus-code'
                  value={bonusCodeVal}
                  onInput={onInput}
                />

                <div className='field_bottom'>
                  <div
                    className='field_error'
                    data-error='minimum_6_characters'
                  >
                    This field must be a text with minimum 6 characters
                  </div>
                  <div
                    className='field_error'
                    data-error='only_letters_numbers'
                  >
                    This field must contain only letters and numbers
                  </div>
                </div>
              </div>
            </div>

            <button
              className='site-button purple width-full'
              id='collect_reward_bonus_redeem'
            >
              Collect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
