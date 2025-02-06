'use client';
import Input from '@/components/ui/Input';
import { ChangeEvent, useState } from 'react';

const page = () => {
  const [formData, setFormData] = useState({
    referral: '',
    code: '',
    depositSearch: '',
    maintenanceStatus: 'Enable',
    maintenanceReason: '',
    gamesStatus: 'Enable',
    tradesStatus: 'Enable',
    coinflip: true,
    unboxing: true,
    caseBattle: false,
    plinko: false,
    userId: '',
    dashboardAccess: '',
    joinRefferalsExpire: 'Never',
    joinRefferalsUsage: '',
    joinRefferalsSearch: '',
  });

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log(name);
    console.log(formData.coinflip);

    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
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
    <div className='width-12 flex row responsive gap-2'>
      <div className='flex column gap-2 width-5 responsive height-full'>
        <div className='flex column gap-4 bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column gap-2 text-left'>
            <div className='font-8'>
              <span>
                Status Server -{' '}
                <span>
                  <span className='status-server'>
                    <span
                      className='text-warning hidden'
                      data-status='connecting'
                    >
                      Connecting
                    </span>
                    <span className='text-success' data-status='running'>
                      Running
                    </span>
                    <span
                      className='text-danger hidden'
                      data-status='connection_lost'
                    >
                      Connection lost
                    </span>
                  </span>
                </span>
              </span>
            </div>
            <div className='font-8'>
              Maintenance - <span className='text-danger'>Inactive</span>
            </div>
            <div className='font-8'>
              Status Games - <span className='text-success'>Active</span>
            </div>
            <div className='font-8'>
              Status Trades - <span className='text-success'>Active</span>
            </div>
          </div>

          <div className='flex column gap-2 text-left'>
            <div className='font-8'>
              Coinflip - <span className='text-success'>Active</span>
            </div>
            <div className='font-8'>
              Unboxing - <span className='text-success'>Active</span>
            </div>
            <div className='font-8'>
              Case Battle - <span className='text-success'>Active</span>
            </div>
            <div className='font-8'>
              Plinko - <span className='text-success'>Active</span>
            </div>
          </div>
        </div>

        <div className='flex column gap-2 bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>Deposit Bonuses</div>

            <div className='flex column width-full'>
              <div className='flex row responsive gap-2 width-full'>
                <div className='input_field transition' data-border='#de4c41'>
                  <Input
                    label='Referral'
                    name='referral'
                    value={formData.referral}
                    onInput={onInput}
                  />
                  <div className='field_bottom'>
                    <div className='field_error active' data-error='required'>
                      This field is required
                    </div>
                  </div>
                </div>

                <div className='input_field transition' data-border='#de4c41'>
                  <Input
                    label='Code'
                    name='code'
                    value={formData.code}
                    onInput={onInput}
                  />

                  <div className='field_bottom'>
                    <div className='field_error active' data-error='required'>
                      This field is required
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex column gap-1'>
                <div
                  className='input_field bet_input_field transition-5'
                  data-border='#de4c41'
                >
                  <Input
                    label='DepositSearch'
                    name='depositSearch'
                    value={formData.depositSearch}
                    onInput={onInput}
                  />

                  <div className='field_bottom'></div>
                </div>

                <div className='table-container'>
                  <div className='table-header'>
                    <div className='table-row'>
                      <div className='table-column text-left'>Code</div>
                      <div className='table-column text-left'>Referral</div>
                      <div className='table-column text-left'>Uses</div>
                      <div className='table-column text-left'>Amount</div>
                      <div className='table-column text-right'>Action</div>
                    </div>
                  </div>

                  <div className='table-body' id='admin_deposit_bonuses'>
                    <div className='table-row table_message'>
                      <div className='table-column'>No data found</div>
                    </div>
                  </div>

                  <div className='table-footer'>
                    <div className='flex items-center justify-center bg-dark p-2'>
                      <div
                        className='pagination-content flex row gap-2'
                        id='pagination_admin_deposit_bonuses'
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
        <div className='flex column gap-2 bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>Alerts</div>

            <div className='flex column gap-1 width-full'>
              <div
                className='input_field bet_input_field transition-5'
                data-border='#de4c41'
              >
                <div className='field_container'>
                  <div className='field_content'>
                    <input
                      type='text'
                      className='field_element_input'
                      id='admin_alert_alert'
                      value=''
                    />

                    <div className='field_label transition-5'>Alert</div>
                  </div>

                  <div className='field_extra'>
                    <button className='site-button purple' id='admin_alert_set'>
                      Set
                    </button>
                  </div>
                </div>

                <div className='field_bottom'></div>
              </div>

              <div className='flex column gap-2'>
                <div className='flex row gap-1 items-center justify-between bg-light rounded-1 b-d2 p-2'>
                  <div className='text-left'>
                    We added P2P trading system and loading the CS2 items wear.
                    Check it out.
                  </div>

                  <button
                    className='site-button purple admin_alert_unset'
                    data-id='0'
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex column gap-2 bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>Notifies</div>

            <div className='flex column gap-1 width-full'>
              <div
                className='input_field bet_input_field transition-5'
                data-border='#de4c41'
              >
                <div className='field_container'>
                  <div className='field_content'>
                    <input
                      type='text'
                      className='field_element_input'
                      id='admin_notify_notify'
                      value=''
                    />

                    <div className='field_label transition-5'>Notify</div>
                  </div>

                  <div className='field_extra'>
                    <button
                      className='site-button purple'
                      id='admin_notify_set'
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div className='field_bottom'></div>
              </div>

              <div className='flex column gap-2'>
                <div className='flex row gap-1 items-center justify-between bg-light rounded-1 b-d2 p-2'>
                  <div className='text-left'>
                    We added P2P trading system and loading the CS2 items wear.
                    Check it out.
                  </div>

                  <button
                    className='site-button purple admin_notify_unset'
                    data-id='0'
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex column gap-2 width-7 responsive height-full'>
        <div className='flex column gap-2 bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>Maintenance</div>

            <div className='flex row responsive gap-2 width-full'>
              <div className='dropdown_field transition-5'>
                <Input
                  label='Status'
                  name='maintenanceStatus'
                  value={formData.maintenanceStatus}
                  onSelect={onSelect}
                  dropdownData={[{ value: 'Enable' }, { value: 'Disable' }]}
                  activeVal={formData.maintenanceStatus}
                />

                <div className='field_bottom'></div>
              </div>

              <div className='input_field transition' data-border='#de4c41'>
                <Input
                  label='Reason'
                  name='maintenanceReason'
                  value={formData.maintenanceReason}
                  onInput={onInput}
                  extra={
                    <button
                      className='site-button purple'
                      id='admin_maintenance_set'
                    >
                      Set
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

          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>Games</div>

            <div className='flex row responsive items-center gap-2'>
              <div className='dropdown_field transition-5'>
                <Input
                  label='Status'
                  name='gamesStatus'
                  value={formData.gamesStatus}
                  onSelect={onSelect}
                  dropdownData={[{ value: 'Enable' }, { value: 'Disable' }]}
                  activeVal={formData.gamesStatus}
                />

                <div className='field_bottom'></div>
              </div>

              <button
                className='site-button purple admin_dropdown_settings'
                data-settings='games_status'
              >
                Set
              </button>
            </div>
          </div>

          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>Trades</div>

            <div className='flex row responsive items-center gap-2'>
              <div className='dropdown_field transition-5'>
                <Input
                  label='Status'
                  name='tradesStatus'
                  value={formData.tradesStatus}
                  onSelect={onSelect}
                  dropdownData={[{ value: 'Enable' }, { value: 'Disable' }]}
                  activeVal={formData.tradesStatus}
                />

                <div className='field_bottom'></div>
              </div>

              <button
                className='site-button purple admin_dropdown_settings'
                data-settings='trades_status'
              >
                Set
              </button>
            </div>
          </div>

          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>Games</div>

            <div className=' text-left gap-1 flex width-full'>
              <div className='switch_field height-full transition-5'>
                <div className='field_container '>
                  <div className='field_content'>
                    <input
                      type='checkbox'
                      className='field_element_input admin_switch_settings !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                      data-settings='games_enable_coinflip'
                      onChange={onChange}
                      name='coinflip'
                      checked={formData.coinflip}
                    />

                    <div className='field_switch'>
                      <div
                        className={`field_switch_bar ${
                          formData.coinflip
                            ? '!bg-green-400'
                            : '!bg-red-500 before:!left-0'
                        }`}
                      ></div>
                    </div>

                    <div className='field_label active transition-5'>
                      Coinflip
                    </div>
                  </div>

                  <div className='field_extra'></div>
                </div>

                <div className='field_bottom'></div>
              </div>

              <div className='switch_field height-full transition-5'>
                <div className='field_container'>
                  <div className='field_content'>
                    <input
                      type='checkbox'
                      className='field_element_input admin_switch_settings !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                      onChange={onChange}
                      name='unboxing'
                      checked={formData.unboxing}
                    />

                    <div className='field_switch'>
                      <div
                        className={`field_switch_bar ${
                          formData.unboxing
                            ? '!bg-green-400'
                            : '!bg-red-500 before:!left-0'
                        }`}
                      ></div>
                    </div>

                    <div className='field_label active transition-5'>
                      Unboxing
                    </div>
                  </div>

                  <div className='field_extra'></div>
                </div>

                <div className='field_bottom'></div>
              </div>

              <div className='switch_field height-full transition-5'>
                <div className='field_container'>
                  <div className='field_content'>
                    <input
                      type='checkbox'
                      className='field_element_input admin_switch_settings !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                      onChange={onChange}
                      name='caseBattle'
                      checked={formData.caseBattle}
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
                      Case Battle
                    </div>
                  </div>

                  <div className='field_extra'></div>
                </div>

                <div className='field_bottom'></div>
              </div>

              <div className='switch_field height-full transition-5'>
                <div className='field_container'>
                  <div className='field_content'>
                    <input
                      type='checkbox'
                      className='field_element_input admin_switch_settings !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                      data-settings='games_enable_coinflip'
                      onChange={onChange}
                      name='plinko'
                      checked={formData.plinko}
                    />

                    <div className='field_switch'>
                      <div
                        className={`field_switch_bar ${
                          formData.plinko
                            ? '!bg-green-400'
                            : '!bg-red-500 before:!left-0'
                        }`}
                      ></div>
                    </div>

                    <div className='field_label active transition-5'>
                      Plinko
                    </div>
                  </div>

                  <div className='field_extra'></div>
                </div>

                <div className='field_bottom'></div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex column gap-2 bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>
              Admin Access -{' '}
              <span className='text-success'>27157d4642ba4b6e4ac03bdb</span>
            </div>

            <div className='input_field transition' data-border='#de4c41'>
              <div className='field_container'>
                <div className='field_content'>
                  <input
                    type='text'
                    className='field_element_input'
                    id='admin_admin_access_userid'
                    value=''
                  />

                  <div className='field_label transition'>User Id</div>
                </div>

                <div className='field_extra flex gap-1'>
                  <button
                    className='site-button purple'
                    id='admin_admin_access_set'
                  >
                    Set
                  </button>
                  <button
                    className='site-button purple'
                    id='admin_admin_access_unset'
                  >
                    Unset
                  </button>
                </div>
              </div>

              <div className='field_bottom'>
                <div className='field_error active' data-error='required'>
                  This field is required
                </div>
              </div>
            </div>
          </div>

          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>
              Dashboard Access -{' '}
              <span className='text-success'>27157d4642ba4b6e4ac03bdb</span>
            </div>

            <div className='input_field transition' data-border='#de4c41'>
              <div className='field_container'>
                <div className='field_content'>
                  <input
                    type='text'
                    className='field_element_input'
                    id='admin_dashboard_access_userid'
                    value=''
                  />

                  <div className='field_label transition'>User Id</div>
                </div>

                <div className='field_extra flex gap-1'>
                  <button
                    className='site-button purple'
                    id='admin_dashboard_access_set'
                  >
                    Set
                  </button>
                  <button
                    className='site-button purple'
                    id='admin_dashboard_access_unset'
                  >
                    Unset
                  </button>
                </div>
              </div>

              <div className='field_bottom'>
                <div className='field_error active' data-error='required'>
                  This field is required
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex column gap-2 bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='flex column items-start gap-2'>
            <div className='text-left font-8'>Join Referrals</div>

            <div className='flex column width-full'>
              <div className='flex row responsive gap-2 width-full'>
                <div className='dropdown_field transition-5'>
                  <Input
                    label='Status'
                    name='joinRefferalsExpire'
                    value={formData.joinRefferalsExpire}
                    onSelect={onSelect}
                    dropdownData={[
                      { value: 'Never' },
                      { value: 'One day' },
                      { value: 'One week' },
                      { value: 'One month' },
                    ]}
                    activeVal={formData.joinRefferalsExpire}
                  />

                  <div className='field_bottom'></div>
                </div>

                <div className='input_field transition' data-border='#de4c41'>
                  <Input
                    label='Usage'
                    name='joinRefferalsUsage'
                    value={formData.joinRefferalsUsage}
                    onInput={onInput}
                  />

                  <div className='field_bottom'>
                    <div className='field_error active' data-error='required'>
                      This field is required
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex column gap-1'>
                <div
                  className='input_field bet_input_field transition-5'
                  data-border='#de4c41'
                >
                  <Input
                    label='Search join referral'
                    name='joinRefferalsSearch'
                    value={formData.joinRefferalsSearch}
                    onInput={onInput}
                  />

                  <div className='field_bottom'></div>
                </div>

                <div className='table-container'>
                  <div className='table-header'>
                    <div className='table-row'>
                      <div className='table-column text-left'>Raferral</div>
                      <div className='table-column text-left'>User Id</div>
                      <div className='table-column text-left'>Usage</div>
                      <div className='table-column text-right'>Action</div>
                    </div>
                  </div>

                  <div className='table-body' id='admin_join_referrals'>
                    <div className='table-row table_message'>
                      <div className='table-column'>No data found</div>
                    </div>
                  </div>

                  <div className='table-footer'>
                    <div className='flex items-center justify-center bg-dark p-2'>
                      <div
                        className='pagination-content flex row gap-2'
                        id='pagination_admin_join_referrals'
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
      </div>
    </div>
  );
};

export default page;
