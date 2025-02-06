'use client';

import Input from '@/components/ui/Input';
import { ChangeEvent, useState } from 'react';

const page = () => {
  const [formData, setFormData] = useState({
    coinFlip: false,
    caseBattle: false,
    botName: '',
    search: '',
    orderBy: 'Creation date',
  });

  const onSelect = (value: string, name?: string) => {
    if (name) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  return (
    <div className='width-12 flex row responsive gap-2'>
      <div className='width-4 responsive flex column gap-2 text-left height-full bg-light-transparent rounded-1 b-l2 p-2'>
        <div className='flex column items-start gap-2'>
          <div className='text-left font-8'>Game Bots</div>

          <div className='flex column gap-2'>
            <div className='flex row gap-2'>
              <div className='switch_field height-full transition-5'>
                <div className='field_container'>
                  <div className='field_content'>
                    <input
                      type='checkbox'
                      className='field_element_input admin_switch_settings !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                      onChange={onChange}
                      name='coinFlip'
                      checked={formData.coinFlip}
                      data-settings='games_bots_enable_coinflip'
                    />

                    <div className='field_switch'>
                      <div
                        className={`field_switch_bar ${
                          formData.coinFlip
                            ? '!bg-green-400'
                            : '!bg-red-500 before:!left-0'
                        }`}
                      ></div>{' '}
                    </div>

                    <div className='field_label active transition-5'>
                      Coinflip Game Bots
                    </div>
                  </div>

                  <div className='field_extra'></div>
                </div>

                <div className='field_bottom'></div>
              </div>

              <div className='text-left mt-2'>
                If this is enabled, all users can call bots on Coinflip Game.
              </div>
            </div>

            <div className='flex row gap-2'>
              <div className='switch_field height-full transition-5'>
                <div className='field_container'>
                  <div className='field_content'>
                    <input
                      type='checkbox'
                      name='caseBattle'
                      className='field_element_input admin_switch_settings !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                      onChange={onChange}
                      checked={formData.caseBattle}
                      data-settings='games_bots_enable_casebattle'
                    />

                    <div className='field_switch'>
                      <div
                        className={`field_switch_bar ${
                          formData.caseBattle
                            ? '!bg-green-400'
                            : '!bg-red-500 before:!left-0'
                        }`}
                      ></div>
                    </div>
                    <div className='field_label active transition-5'>
                      Casebattle Game Bots
                    </div>

                    <div className='field_extra'></div>
                  </div>

                  <div className='field_bottom'></div>
                </div>
              </div>
              <div className='text-left mt-2'>
                If this is enabled, all users can call bots on Case Battle Game.
              </div>
            </div>
            <div className='input_field transition' data-border='#de4c41'>
              <Input
                label='Bot name'
                name='botName'
                value={formData.botName}
                onInput={onInput}
                extra={
                  <button
                    className='site-button purple'
                    id='admin_gamebots_create'
                  >
                    Create
                  </button>
                }
              />

              <div className='field_bottom'>
                <div className='field_error active' data-error='required'>
                  This field is required
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='width-8 responsive flex column gap-2 height-full'>
        <div className='bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column gap-1'>
            <div className='flex gap-1'>
              <div className='input_field transition-5' data-border='#de4c41'>
                <Input
                  label='Search Bot (userid, username, name)'
                  name='search'
                  value={formData.search}
                  onInput={onInput}
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
                    { value: 'Creation date' },
                    { value: 'Name A-Z' },
                    { value: 'Name Z-A' },
                    { value: 'Balance acending' },
                    { value: 'Balance descending' },
                  ]}
                />

                <div className='field_bottom'></div>
              </div>
            </div>

            <div className='table-container'>
              <div className='table-header'>
                <div className='table-row'>
                  <div className='table-column text-left'>User</div>
                  <div className='table-column text-left'>User Id</div>
                  <div className='table-column text-left'>Balance</div>
                  <div className='table-column text-right'>Action</div>
                </div>
              </div>
              <div className='table-body' id='admin_gamebots_list'>
                <div className='table-row table_message'>
                  <div className='table-column'>No data found</div>
                </div>
              </div>
              <div className='table-footer'>
                <div className='flex items-center justify-center bg-dark p-2'>
                  <div
                    className='pagination-content flex row gap-2'
                    id='pagination_admin_gamebots'
                  >
                    <div
                      className='pagination-item flex items-center justify-center'
                      data-page='1'
                    >
                      «
                    </div>

                    <div className='flex row gap-1'>
                      <div
                        className='pagination-item flex items-center justify-center active'
                        data-page='1'
                      >
                        1
                      </div>
                    </div>

                    <div
                      className='pagination-item flex items-center justify-center'
                      data-page='1'
                    >
                      »
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
