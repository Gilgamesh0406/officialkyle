'use client';
import Input from '@/components/ui/Input';
import { ChangeEvent, useState } from 'react';

const page = () => {
  const [tab, setTab] = useState(1);
  const [formData, setFormData] = useState({
    ip: '',
    rank: 'Admin',
    amount: '',
    siteBan: '',
    siteAmount: '',
    siteDate: 'Minutes',
    playBan: '',
    playAmount: '',
    playDate: 'Minutes',
    tradeBan: '',
    tradeAmount: '',
    tradeDate: 'Minutes',
    chatBan: '',
    chatAmount: '',
    chatDate: 'Minutes',
  });
  const dateSelect = [
    { value: 'Minutes' },
    { value: 'Hours' },
    { value: 'Days' },
    { value: 'Months' },
    { value: 'Years' },
  ];

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const onSelect = (value: string, name?: string) => {
    if (name) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  return (
    <div className='flex column gap-1'>
      <div className='flex justify-start'>
        <a href='/admin/users'>
          <button className='site-button black'>
            <i className='fa fa-arrow-left mr-1'></i> Back to list
          </button>
        </a>
      </div>

      <div className='width-12 flex row responsive gap-2'>
        <div className='width-5 responsive flex column gap-2 height-full bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex row responsive items-center justify-between gap-2 p-2 bb-l2'>
            <div className='flex row items-center gap-2'>
              <div className='avatar-field tier-steel'>
                <div className='inline-block relative'>
                  <img
                    className='avatar icon-large rounded-full'
                    src='https://crazycargo.gg/template/img/avatar.jpg'
                  />
                  <div className='level sup-large-left flex justify-center items-center b-d2 bg-dark rounded-full'>
                    0
                  </div>
                </div>
              </div>

              <div className='flex column items-start'>
                <div className='flex justify-start gap-2 text-upper text-bold ellipsis'>
                  <div className='chat-link-member'>member</div>
                  <div>mykola</div>
                </div>

                <div className='ellipsis font-6'>
                  mykola (7bf3af0a699ffe55e7795247)
                </div>
              </div>
            </div>

            <a href='/profile/7bf3af0a699ffe55e7795247' target='_blank'>
              <button className='site-button purple'>Profile</button>
            </a>
          </div>

          <div className='flex column mt-2 gap-2 text-left'>
            <div className='font-8'>Registed - 24 April 2024, 06:09 AM</div>

            <div className='font-8'>
              Balance - <span className='text-success'>0.00</span>
            </div>
            <div className='font-8'>
              Available Withdraw - <span className='text-success'>0.00</span>
            </div>
            <div className='font-8'>
              Profile Status - <span className='text-danger'>Unverified</span>
            </div>
            <div className='text-left font-8'>
              Two Factory Authentication -{' '}
              <span className='text-danger'>Disabled</span>
            </div>
            <div className='font-8'>
              Anonymous - <span className='text-success'>Inactive</span>
            </div>
            <div className='font-8'>
              Private Mode - <span className='text-success'>Public</span>
            </div>
            <div className='font-8'>
              Bind Account Steam - <span className='text-danger'>No</span>
            </div>
            <div className='font-8'>
              Bind Account Google - <span className='text-danger'>No</span>
            </div>
            <div className='font-8'>
              Bind Account Discord - <span className='text-danger'>No</span>
            </div>
            <div className='font-8'>
              Bind Account Facebook - <span className='text-danger'>No</span>
            </div>

            <div className='text-left font-8 text-danger'>
              Self Exclusion Inactive
            </div>
          </div>
        </div>

        <div className='width-7 responsive flex column gap-2 height-full'>
          <div className='bg-light-transparent rounded-1 b-l2 p-2'>
            <div className='grid split-column-full responsive gap-1 mb-2'>
              <button
                onClick={() => setTab(0)}
                className='site-button black dashboard-load switch_panel active'
                data-id='user_control'
                data-panel='summary'
              >
                Summary
              </button>
              <button
                onClick={() => setTab(1)}
                className='site-button black dashboard-load switch_panel'
                data-id='user_control'
                data-panel='restrictions'
              >
                Restrictions
              </button>
            </div>

            {tab === 0 ? (
              <div
                className='switch_content'
                data-id='user_control'
                data-panel='summary'
              >
                <div className='flex column gap-2 text-left'>
                  <div className='flex column items-start gap-1 width-full'>
                    <div className='text-left font-8'>Remove Binds</div>

                    <div className='grid split-column-4 responsive gap-1 width-full'>
                      <button className='site-button disabled purple width-full'>
                        Not binded with Steam
                      </button>

                      <button className='site-button disabled purple width-full'>
                        Not binded with Google
                      </button>

                      <button className='site-button disabled purple width-full'>
                        Not binded with Discord
                      </button>

                      <button className='site-button disabled purple width-full'>
                        Not binded with Facebook
                      </button>
                    </div>
                  </div>

                  <div className='flex column items-start gap-2'>
                    <div className='text-left font-8'>
                      User Exclusion -{' '}
                      <span className='text-danger'>Inactive</span>
                    </div>

                    <button className='site-button purple disabled'>
                      Remove Exclusion
                    </button>
                  </div>

                  <div className='flex column items-start gap-2'>
                    <div className='text-left font-8'>
                      Logout -{' '}
                      <span className='text-danger'>Not logged in</span>
                    </div>

                    <button className='site-button purple disabled'>
                      No active sessions
                    </button>
                  </div>

                  <div className='flex column items-start gap-2'>
                    <div className='text-left font-8'>
                      Ban IP Login -{' '}
                      <span className='text-success'>No IPs Banned</span>
                    </div>

                    <div
                      className='input_field transition'
                      data-border='#de4c41'
                    >
                      <Input
                        label='IP'
                        name='ip'
                        value={formData.ip}
                        onInput={onInput}
                        extra={
                          <>
                            <button
                              className='site-button purple'
                              id='admin_user_ip_ban'
                            >
                              Ban
                            </button>
                            <button
                              className='site-button purple'
                              id='admin_user_ip_unban'
                            >
                              Unban
                            </button>
                          </>
                        }
                      />

                      <div className='field_bottom'>
                        <div
                          className='field_error active'
                          data-error='required'
                        >
                          This field is required
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex column items-start gap-2'>
                    <div className='text-left font-8'>
                      Set Rank -{' '}
                      <span className='text-success'>Active Rank - Member</span>
                    </div>

                    <div className='flex row responsive items-center gap-2'>
                      <div className='dropdown_field transition-5'>
                        <Input
                          label='rank'
                          name='rank'
                          value={formData.rank}
                          onSelect={onSelect}
                          dropdownData={[
                            { value: 'Admin' },
                            { value: 'Member' },
                            { value: 'Owner' },
                            { value: 'Moderator' },
                            { value: 'Helper' },
                            { value: 'Veterarn' },
                            { value: 'Pro' },
                            { value: 'Youtuber' },
                            { value: 'Streamer' },
                            { value: 'Developer' },
                          ]}
                          activeVal={formData.rank}
                        />

                        <div className='field_bottom'></div>
                      </div>

                      <button
                        className='site-button purple'
                        id='admin_user_rank_set'
                      >
                        Confirm
                      </button>
                    </div>
                  </div>

                  <div className='flex column items-start gap-2'>
                    <div className='text-left font-8'>Edit Balance</div>

                    <div
                      className='input_field transition'
                      data-border='#de4c41'
                    >
                      <Input
                        label='Amount'
                        name='amount'
                        value={formData.amount}
                        onInput={onInput}
                        extra={
                          <button
                            className='site-button purple'
                            id='admin_user_balance_edit'
                          >
                            Confirm
                          </button>
                        }
                      />

                      <div className='field_bottom'>
                        <div className='field_error' data-error='required'>
                          This field is required
                        </div>
                        <div className='field_error' data-error='number'>
                          This field must be a number
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className='switch_content'
                data-id='user_control'
                data-panel='restrictions'
              >
                <div className='flex column items-start gap-2 text-left'>
                  <div className='flex column items-start gap-1 width-full'>
                    <div className='text-left font-8'>
                      User Restriction -{' '}
                      <span className='text-success'>
                        Site Ban - This user is not restricted
                      </span>
                    </div>

                    <div className='flex row responsive items-center justify-center gap-2 width-full'>
                      <div
                        className='input_field transition'
                        data-border='#de4c41'
                      >
                        <Input
                          label='Reason'
                          name='siteBan'
                          value={formData.siteBan}
                          onInput={onInput}
                        />

                        <div className='field_bottom'>
                          <div
                            className='field_error active'
                            data-error='required'
                          >
                            This field is required
                          </div>
                        </div>
                      </div>

                      <div className='dropdown_field transition-5'>
                        <Input
                          label='Format Date'
                          name='siteDate'
                          value={formData.siteDate}
                          onSelect={onSelect}
                          dropdownData={dateSelect}
                          activeVal={formData.siteDate}
                        />

                        <div className='field_bottom'></div>
                      </div>

                      <div
                        className='input_field transition'
                        data-border='#de4c41'
                      >
                        <Input
                          label='siteAmount'
                          name='siteAmount'
                          value={formData.siteAmount}
                          onInput={onInput}
                          extra={
                            <>
                              <button
                                className='site-button purple admin_user_restriction_set'
                                data-restriction='site'
                              >
                                Confirm
                              </button>
                              <button
                                className='site-button purple admin_user_restriction_permanently'
                                data-restriction='site'
                              >
                                Permanently
                              </button>
                            </>
                          }
                        />

                        <div className='field_bottom'>
                          <div className='field_error' data-error='required'>
                            This field is required
                          </div>
                          <div className='field_error' data-error='number'>
                            This field must be a number
                          </div>
                          <div
                            className='field_error'
                            data-error='positive_integer'
                          >
                            This field must be a positive integer number
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex column items-start gap-1 width-full'>
                    <div className='text-left font-8'>
                      User Restriction -{' '}
                      <span className='text-success'>
                        Play Ban - This user is not restricted
                      </span>
                    </div>

                    <div className='flex row responsive items-center justify-center gap-2 width-full'>
                      <div
                        className='input_field transition'
                        data-border='#de4c41'
                      >
                        <Input
                          label='Reason'
                          name='playBan'
                          value={formData.playBan}
                          onInput={onInput}
                        />

                        <div className='field_bottom'>
                          <div
                            className='field_error active'
                            data-error='required'
                          >
                            This field is required
                          </div>
                        </div>
                      </div>

                      <div className='dropdown_field transition-5'>
                        <Input
                          label='Format Date'
                          name='playDate'
                          value={formData.playDate}
                          onSelect={onSelect}
                          dropdownData={dateSelect}
                          activeVal={formData.playDate}
                        />

                        <div className='field_bottom'></div>
                      </div>

                      <div
                        className='input_field transition'
                        data-border='#de4c41'
                      >
                        <Input
                          label='Amount'
                          name='playAmount'
                          value={formData.playAmount}
                          onInput={onInput}
                          extra={
                            <>
                              <button
                                className='site-button purple admin_user_restriction_set'
                                data-restriction='site'
                              >
                                Confirm
                              </button>
                              <button
                                className='site-button purple admin_user_restriction_permanently'
                                data-restriction='site'
                              >
                                Permanently
                              </button>
                            </>
                          }
                        />

                        <div className='field_bottom'>
                          <div className='field_error' data-error='required'>
                            This field is required
                          </div>
                          <div className='field_error' data-error='number'>
                            This field must be a number
                          </div>
                          <div
                            className='field_error'
                            data-error='positive_integer'
                          >
                            This field must be a positive integer number
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex column items-start gap-1 width-full'>
                    <div className='text-left font-8'>
                      User Restriction -{' '}
                      <span className='text-success'>
                        Trade Ban - This user is not restricted
                      </span>
                    </div>

                    <div className='flex row responsive items-center justify-center gap-2 width-full'>
                      <div
                        className='input_field transition'
                        data-border='#de4c41'
                      >
                        <Input
                          label='Reason'
                          name='tradeBan'
                          value={formData.tradeBan}
                          onInput={onInput}
                        />

                        <div className='field_bottom'>
                          <div
                            className='field_error active'
                            data-error='required'
                          >
                            This field is required
                          </div>
                        </div>
                      </div>

                      <div className='dropdown_field transition-5'>
                        <Input
                          label='Format Date'
                          name='tradeDate'
                          value={formData.tradeDate}
                          onSelect={onSelect}
                          dropdownData={dateSelect}
                          activeVal={formData.tradeDate}
                        />

                        <div className='field_bottom'></div>
                      </div>

                      <div
                        className='input_field transition'
                        data-border='#de4c41'
                      >
                        <Input
                          label='Amount'
                          name='tradeAmount'
                          value={formData.tradeAmount}
                          onInput={onInput}
                          extra={
                            <>
                              <button
                                className='site-button purple admin_user_restriction_set'
                                data-restriction='site'
                              >
                                Confirm
                              </button>
                              <button
                                className='site-button purple admin_user_restriction_permanently'
                                data-restriction='site'
                              >
                                Permanently
                              </button>
                            </>
                          }
                        />

                        <div className='field_bottom'>
                          <div className='field_error' data-error='required'>
                            This field is required
                          </div>
                          <div className='field_error' data-error='number'>
                            This field must be a number
                          </div>
                          <div
                            className='field_error'
                            data-error='positive_integer'
                          >
                            This field must be a positive integer number
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex column items-start gap-1 width-full'>
                    <div className='text-left font-8'>
                      User Restriction -{' '}
                      <span className='text-success'>
                        Chat Mute - This user is not restricted
                      </span>
                    </div>

                    <div className='flex row responsive items-center justify-center gap-2 width-full'>
                      <div
                        className='input_field transition'
                        data-border='#de4c41'
                      >
                        <Input
                          label='Reason'
                          name='chatBan'
                          value={formData.chatBan}
                          onInput={onInput}
                        />

                        <div className='field_bottom'>
                          <div
                            className='field_error active'
                            data-error='required'
                          >
                            This field is required
                          </div>
                        </div>
                      </div>

                      <div className='dropdown_field transition-5'>
                        <Input
                          label='Format Date'
                          name='chatDate'
                          value={formData.chatDate}
                          onSelect={onSelect}
                          dropdownData={dateSelect}
                          activeVal={formData.chatDate}
                        />

                        <div className='field_bottom'></div>
                      </div>

                      <div
                        className='input_field transition'
                        data-border='#de4c41'
                      >
                        <Input
                          label='Amount'
                          name='chatAmount'
                          value={formData.chatAmount}
                          onInput={onInput}
                          extra={
                            <>
                              <button
                                className='site-button purple admin_user_restriction_set'
                                data-restriction='site'
                              >
                                Confirm
                              </button>
                              <button
                                className='site-button purple admin_user_restriction_permanently'
                                data-restriction='site'
                              >
                                Permanently
                              </button>
                            </>
                          }
                        />

                        <div className='field_bottom'>
                          <div className='field_error' data-error='required'>
                            This field is required
                          </div>
                          <div className='field_error' data-error='number'>
                            This field must be a number
                          </div>
                          <div
                            className='field_error'
                            data-error='positive_integer'
                          >
                            This field must be a positive integer number
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
