'use client';

import Input from '@/components/ui/Input';
import { ChangeEvent, useState } from 'react';

const page = () => {
  const [tab, setTab] = useState(1);
  const [formData, setFormData] = useState({
    amount: '0.01',
    crypto: true,
    steam: true,
    csgo: true,
    csgo1: true,
    csgo2: true,
    rust: true,
    rust1: true,
    steamCsgo: true,
    steamCsgo1: true,
    steamCsgo2: true,
    steamRust: true,
    steamRust1: true,
    p2pDepositCsgo: true,
    p2pDepositCsgo1: true,
    p2pDepositCsgo2: true,
    p2pDepositRust: true,
    p2pDepositRust1: true,
    p2pWithdrawCsgo: true,
    p2pWithdrawCsgo1: true,
    p2pWithdrawCsgo2: true,
    p2pWithdrawRust: true,
    p2pWithdrawRust1: true,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className='width-12 flex row responsive gap-2'>
      <div className='width-4 responsive flex column gap-2 text-left height-full bg-light-transparent rounded-1 b-l2 p-2'>
        <div className='flex column items-start gap-2'>
          <div className='text-left font-8'>Manually Confirmations</div>

          <div className='flex column gap-2'>
            <div className='input_field transition' data-border='#de4c41'>
              <Input
                label='Confirmation Amount'
                name='amount'
                value={formData.amount}
                onInput={onInput}
                extra={
                  <button
                    className='site-button purple'
                    id='admin_trades_manually_amount_set'
                  >
                    Set
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
                <div className='field_error' data-error='greater'>
                  You must enter a greater value
                </div>
              </div>
            </div>

            <div className='flex row gap-2'>
              <div className='switch_field height-full transition-5'>
                <div className='field_container'>
                  <div className='field_content'>
                    <input
                      type='checkbox'
                      onChange={onChange}
                      name='crypto'
                      className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                      data-settings='trades_manually_enable_crypto'
                      checked={formData.crypto}
                    />

                    <div className='field_switch'>
                      <div
                        className={`field_switch_bar ${
                          formData.crypto
                            ? '!bg-green-400'
                            : '!bg-red-500 before:!left-0'
                        }`}
                      ></div>
                    </div>

                    <div className='field_label active transition-5'>
                      Crypto Confirmations
                    </div>
                  </div>

                  <div className='field_extra'></div>
                </div>

                <div className='field_bottom'></div>
              </div>

              <div className='text-left mt-2'>
                If this is enabled, an admin must to confirm manually the Crypto
                transactions.
              </div>
            </div>

            <div className='flex row gap-2'>
              <div className='switch_field height-full transition-5'>
                <div className='field_container'>
                  <div className='field_content'>
                    <input
                      type='checkbox'
                      onChange={onChange}
                      name='steam'
                      className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                      data-settings='trades_manually_enable_steam'
                      checked={formData.steam}
                    />

                    <div className='field_switch'>
                      <div
                        className={`field_switch_bar ${
                          formData.steam
                            ? '!bg-green-400'
                            : '!bg-red-500 before:!left-0'
                        }`}
                      ></div>
                    </div>

                    <div className='field_label active transition-5'>
                      Steam Confirmations
                    </div>
                  </div>

                  <div className='field_extra'></div>
                </div>

                <div className='field_bottom'></div>
              </div>

              <div className='text-left mt-2'>
                If this is enabled, an admin must to confirm manually the Steam
                transactions.
              </div>
            </div>
          </div>
        </div>

        <div className='flex column items-start gap-2'>
          <div className='text-left font-8'>Steam Deposit</div>

          <div className='width-full flex gap-1 flex-wrap'>
            <div className='switch_field height-full transition-5'>
              <div className='field_container'>
                <div className='field_content'>
                  <input
                    type='checkbox'
                    onChange={onChange}
                    name='csgo'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_deposit_csgo'
                    checked={formData.csgo}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.csgo
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'>CS:GO</div>
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
                    onChange={onChange}
                    name='csgo1'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_deposit_dota2'
                    checked={formData.csgo1}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.csgo1
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
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
                    onChange={onChange}
                    name='csgo2'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_deposit_tf2'
                    checked={formData.csgo2}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.csgo2
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
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
                    onChange={onChange}
                    name='rust'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_deposit_rust'
                    checked={formData.rust}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.rust
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'>Rust</div>
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
                    onChange={onChange}
                    name='rust1'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_deposit_h1z1'
                    checked={formData.rust1}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.rust1
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
                </div>

                <div className='field_extra'></div>
              </div>

              <div className='field_bottom'></div>
            </div>
          </div>
        </div>

        <div className='flex column items-start gap-2'>
          <div className='text-left font-8'>Steam Withdraw</div>

          <div className='width-full flex gap-1 flex-wrap'>
            <div className='switch_field height-full transition-5'>
              <div className='field_container'>
                <div className='field_content'>
                  <input
                    type='checkbox'
                    onChange={onChange}
                    name='steamCsgo'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_withdraw_csgo'
                    checked={formData.steamCsgo}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.steamCsgo
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'>CS:GO</div>
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
                    onChange={onChange}
                    name='steamCsgo1'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_withdraw_dota2'
                    checked={formData.steamCsgo1}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.steamCsgo1
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
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
                    onChange={onChange}
                    name='steamCsgo2'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_withdraw_tf2'
                    checked={formData.steamCsgo2}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.steamCsgo2
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
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
                    onChange={onChange}
                    name='steamRust'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_withdraw_rust'
                    checked={formData.steamRust}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.steamRust
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'>Rust</div>
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
                    onChange={onChange}
                    name='steamRust1'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_steam_enable_withdraw_h1z1'
                    checked={formData.steamRust1}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.steamRust1
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
                </div>

                <div className='field_extra'></div>
              </div>

              <div className='field_bottom'></div>
            </div>
          </div>
        </div>

        <div className='flex column items-start gap-2'>
          <div className='text-left font-8'>P2P Deposit</div>

          <div className='width-full flex gap-1 flex-wrap'>
            <div className='switch_field height-full transition-5'>
              <div className='field_container'>
                <div className='field_content'>
                  <input
                    type='checkbox'
                    onChange={onChange}
                    name='p2pDepositCsgo'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_p2p_enable_deposit_csgo'
                    checked={formData.p2pDepositCsgo}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pDepositCsgo
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'>CS:GO</div>
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
                    onChange={onChange}
                    name='p2pDepositCsgo1'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_p2p_enable_deposit_dota2'
                    checked={formData.p2pDepositCsgo1}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pDepositCsgo1
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
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
                    onChange={onChange}
                    name='p2pDepositCsgo2'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_p2p_enable_deposit_tf2'
                    checked={formData.p2pDepositCsgo2}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pDepositCsgo2
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
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
                    onChange={onChange}
                    name='p2pDepositRust'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_p2p_enable_deposit_rust'
                    checked={formData.p2pDepositRust}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pDepositRust
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'>Rust</div>
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
                    onChange={onChange}
                    name='p2pDepositRust1'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_p2p_enable_deposit_h1z1'
                    checked={formData.p2pDepositRust1}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pDepositRust1
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
                </div>

                <div className='field_extra'></div>
              </div>

              <div className='field_bottom'></div>
            </div>
          </div>
        </div>

        <div className='flex column items-start gap-2'>
          <div className='text-left font-8'>P2P Withdraw</div>

          <div className='width-full flex gap-1 flex-wrap'>
            <div className='switch_field height-full transition-5'>
              <div className='field_container'>
                <div className='field_content'>
                  <input
                    type='checkbox'
                    onChange={onChange}
                    name='p2pWithdrawCsgo'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_p2p_enable_withdraw_csgo'
                    checked={formData.p2pWithdrawCsgo}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pWithdrawCsgo
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'>CS:GO</div>
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
                    onChange={onChange}
                    name='p2pWithdrawCsgo1'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    checked={formData.p2pWithdrawCsgo1}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pWithdrawCsgo1
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
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
                    onChange={onChange}
                    name='p2pWithdrawCsgo2'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_p2p_enable_withdraw_tf2'
                    checked={formData.p2pWithdrawCsgo2}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pWithdrawCsgo2
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
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
                    onChange={onChange}
                    name='p2pWithdrawRust'
                    className='field_element_input admin_switch_settings  !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_p2p_enable_withdraw_rust'
                    checked={formData.p2pWithdrawRust}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pWithdrawRust
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'>Rust</div>
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
                    onChange={onChange}
                    name='p2pWithdrawRust1'
                    className='field_element_input admin_switch_settings !flex !absolute !top-0 !left-0 !w-full !h-full z-50 opacity-0'
                    data-settings='trades_p2p_enable_withdraw_h1z1'
                    checked={formData.p2pWithdrawRust1}
                  />

                  <div className='field_switch'>
                    <div
                      className={`field_switch_bar ${
                        formData.p2pWithdrawRust1
                          ? '!bg-green-400'
                          : '!bg-red-500 before:!left-0'
                      }`}
                    ></div>
                  </div>

                  <div className='field_label active transition-5'></div>
                </div>

                <div className='field_extra'></div>
              </div>

              <div className='field_bottom'></div>
            </div>
          </div>
        </div>
      </div>

      <div className='width-8 responsive flex column gap-2 height-full'>
        <div className='bg-light-transparent rounded-1 b-l2 p-2'>
          <div className='grid split-column-full responsive gap-1 mb-2'>
            <button
              onClick={() => setTab(0)}
              className='site-button black dashboard-load switch_panel active'
              data-id='confirmation'
              data-panel='crypto'
            >
              Crypto
            </button>
            <button
              onClick={() => setTab(1)}
              className='site-button black dashboard-load switch_panel'
              data-id='confirmation'
              data-panel='steam'
            >
              Steam
            </button>
          </div>

          {tab === 0 ? (
            <div
              className='switch_content'
              data-id='confirmation'
              data-panel='crypto'
            >
              <div className='table-container'>
                <div className='table-header'>
                  <div className='table-row'>
                    <div className='table-column text-left'>Id</div>
                    <div className='table-column text-left'>User Id</div>
                    <div className='table-column text-left'>Amount</div>
                    <div className='table-column text-left'>Currency</div>
                    <div className='table-column text-left'>Date</div>
                    <div className='table-column text-right'>Action</div>
                  </div>
                </div>

                <div className='table-body' id='admin_crypto_confirmations'>
                  <div className='table-row table_message'>
                    <div className='table-column'>No data found</div>
                  </div>
                </div>

                <div className='table-footer'>
                  <div className='flex items-center justify-center bg-dark p-2'>
                    <div
                      className='pagination-content flex row gap-2'
                      id='pagination_admin_crypto_confirmations'
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
          ) : (
            <div
              className='switch_content '
              data-id='confirmation'
              data-panel='steam'
            >
              <div className='table-container'>
                <div className='table-header'>
                  <div className='table-row'>
                    <div className='table-column text-left'>Id</div>
                    <div className='table-column text-left'>User Id</div>
                    <div className='table-column text-left'>Amount</div>
                    <div className='table-column text-left'>Items</div>
                    <div className='table-column text-left'>Game</div>
                    <div className='table-column text-left'>Date</div>
                    <div className='table-column text-right'>Action</div>
                  </div>
                </div>

                <div className='table-body' id='admin_steam_confirmations'>
                  <div className='table-row table_message'>
                    <div className='table-column'>No data found</div>
                  </div>
                </div>

                <div className='table-footer'>
                  <div className='flex items-center justify-center bg-dark p-2'>
                    <div
                      className='pagination-content flex row gap-2'
                      id='pagination_admin_steam_confirmations'
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
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
