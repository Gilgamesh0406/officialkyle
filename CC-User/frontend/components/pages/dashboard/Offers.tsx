'use client';

import { useState } from 'react';

const Offers = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className='switch_content' data-id='dashboard' data-panel='offers'>
      <div className='grid split-column-full responsive gap-1 mb-2'>
        <button
          onClick={() => setActiveTab(1)}
          className={`site-button black switch_panel dashboard-load ${activeTab === 1 ? 'active' : ''}`}
          data-id='offers_dashboard'
          data-panel='summary'
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`site-button black switch_panel dashboard-load ${activeTab === 1 ? 'active' : ''}`}
          data-id='offers_dashboard'
          data-panel='deposit'
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={`site-button black switch_panel dashboard-load ${activeTab === 1 ? 'active' : ''}`}
          data-id='offers_dashboard'
          data-panel='withdraw'
        >
          Withdraw
        </button>
        <button
          onClick={() => setActiveTab(4)}
          className={`site-button black switch_panel dashboard-load ${activeTab === 1 ? 'active' : ''}`}
          data-id='offers_dashboard'
          data-panel='p2p'
        >
          P2P
        </button>
      </div>

      <div
        className={`${activeTab === 1 ? 'active' : ''} switch_content dashboard-content`}
        data-id='offers_dashboard'
        data-panel='summary'
      >
        <div className='dashboard-stats-grid mb-2'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='total_deposits'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Deposits
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='count_deposits'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Count Deposits
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='total_withdrawls'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Withdrawals
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='count_withdrawls'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Count Withdrawals
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='offers_profit'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Profit
            </div>
          </div>
        </div>

        <div className='flex column gap-2'>
          <div className='grid responsive split-column-2 gap-2'>
            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='deposit_count'
            >
              <div className='text-color font-8'>Deposit Count</div>
              <div className='width-full relative'>
                <div className='dashboard-loader bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <iframe className='chartjs-hidden-iframe'></iframe>
                  <canvas
                    id='dashboard_chart_deposit_count'
                    width='778'
                    height='388'
                  ></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_deposit_count'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_deposit_count'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_deposit_count'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_deposit_count'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>

            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='deposit_total'
            >
              <div className='text-color font-8'>Deposit Total</div>
              <div className='width-full relative'>
                <div className='dashboard-loader bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <iframe className='chartjs-hidden-iframe'></iframe>
                  <canvas
                    id='dashboard_chart_deposit_total'
                    width='778'
                    height='388'
                  ></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_deposit_total'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_deposit_total'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_deposit_total'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_deposit_total'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>
          </div>

          <div className='grid responsive split-column-2 gap-2'>
            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='withdraw_count'
            >
              <div className='text-color font-8'>Withdraw Count</div>
              <div className='width-full relative'>
                <div className='dashboard-loader bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <iframe className='chartjs-hidden-iframe'></iframe>
                  <canvas
                    id='dashboard_chart_withdraw_count'
                    width='778'
                    height='388'
                  ></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_withdraw_count'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_withdraw_count'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_withdraw_count'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_withdraw_count'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>

            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='withdraw_total'
            >
              <div className='text-color font-8'>Withdraw Total</div>
              <div className='width-full relative'>
                <div className='dashboard-loader bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <iframe className='chartjs-hidden-iframe'></iframe>
                  <canvas
                    id='dashboard_chart_withdraw_total'
                    width='778'
                    height='388'
                  ></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_withdraw_total'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_withdraw_total'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_withdraw_total'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_withdraw_total'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${activeTab === 2 ? 'active' : ''} switch_content dashboard-content`}
        data-id='offers_dashboard'
        data-panel='deposit'
      >
        <div className='dashboard-stats-grid mb-2'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='steam_total_deposits'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Steam Total Deposits
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='steam_count_deposits'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Steam Count Deposits
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='crypto_total_deposits'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Crypto Total Deposits
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='crypto_count_deposits'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Crypto Count Deposits
            </div>
          </div>
        </div>

        <div className='flex column gap-2'>
          <div className='grid responsive split-column-2 gap-2'>
            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='steam_deposit_count'
            >
              <div className='text-color font-8'>Steam Deposit Count</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_steam_deposit_count'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_steam_deposit_count'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_steam_deposit_count'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_steam_deposit_count'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_steam_deposit_count'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>

            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='steam_deposit_total'
            >
              <div className='text-color font-8'>Steam Deposit Total</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_steam_deposit_total'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_steam_deposit_total'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_steam_deposit_total'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_steam_deposit_total'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_steam_deposit_total'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>
          </div>

          <div className='grid responsive split-column-2 gap-2'>
            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='crypto_deposit_count'
            >
              <div className='text-color font-8'>Crypto Deposit Count</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_crypto_deposit_count'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_crypto_deposit_count'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_crypto_deposit_count'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_crypto_deposit_count'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_crypto_deposit_count'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>

            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='crypto_deposit_total'
            >
              <div className='text-color font-8'>Crypto Deposit Total</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_crypto_deposit_total'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_crypto_deposit_total'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_crypto_deposit_total'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_crypto_deposit_total'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_crypto_deposit_total'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${activeTab === 3 ? 'active' : ''} switch_content dashboard-content`}
        data-id='offers_dashboard'
        data-panel='withdraw'
      >
        <div className='dashboard-stats-grid mb-2'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='steam_total_withdrawls'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Steam Total Withdrawls
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='steam_count_withdrawls'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Steam Count Withdrawls
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='crypto_total_withdrawls'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Crypto Total Withdrawls
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='crypto_count_withdrawls'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Crypto Count Withdrawls
            </div>
          </div>
        </div>

        <div className='flex column gap-2'>
          <div className='grid responsive split-column-2 gap-2'>
            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='steam_withdraw_count'
            >
              <div className='text-color font-8'>Steam Withdraw Count</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_steam_withdraw_count'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_steam_withdraw_count'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_steam_withdraw_count'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_steam_withdraw_count'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_steam_withdraw_count'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>

            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='steam_withdraw_total'
            >
              <div className='text-color font-8'>Steam Withdraw Total</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_steam_withdraw_total'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_steam_withdraw_total'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_steam_withdraw_total'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_steam_withdraw_total'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_steam_withdraw_total'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>
          </div>

          <div className='grid responsive split-column-2 gap-2'>
            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='crypto_withdraw_count'
            >
              <div className='text-color font-8'>Crypto Withdraw Count</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_crypto_withdraw_count'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_crypto_withdraw_count'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_crypto_withdraw_count'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_crypto_withdraw_count'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_crypto_withdraw_count'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>

            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='crypto_withdraw_total'
            >
              <div className='text-color font-8'>Crypto Withdraw Total</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_crypto_withdraw_total'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_crypto_withdraw_total'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_crypto_withdraw_total'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_crypto_withdraw_total'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_crypto_withdraw_total'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${activeTab === 4 ? 'active' : ''} switch_content dashboard-content`}
        data-id='offers_dashboard'
        data-panel='p2p'
      >
        <div className='dashboard-stats-grid mb-2'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='p2p_total'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              P2P Total
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='p2p_count'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              P2P Count
            </div>
          </div>
        </div>

        <div className='flex column gap-2'>
          <div className='grid responsive split-column-2 gap-2'>
            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='p2p_count'
            >
              <div className='text-color font-8'>P2P Count</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_p2p_count'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_p2p_count'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_p2p_count'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_p2p_count'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_p2p_count'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>

            <div
              className='dashboard-chart flex column items-start gap-2'
              data-graph='p2p_total'
            >
              <div className='text-color font-8'>P2P Total</div>
              <div className='width-full relative'>
                <div className=' bg-light-transparent flex justify-center items-center'>
                  <div className='loader'>
                    <div className='loader-part loader-part-1'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>

                    <div className='loader-part loader-part-2'>
                      <div className='loader-dot loader-dot-1'></div>
                      <div className='loader-dot loader-dot-2'></div>
                    </div>
                  </div>
                </div>

                <div className='width-full'>
                  <canvas id='dashboard_chart_p2p_total'></canvas>
                </div>
              </div>

              <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
                <button
                  className='site-button black dashboard-graph switch_panel active'
                  data-date='day'
                  data-id='chart_p2p_total'
                  data-panel='day'
                >
                  This Day
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='week'
                  data-id='chart_p2p_total'
                  data-panel='week'
                >
                  This Week
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='month'
                  data-id='chart_p2p_total'
                  data-panel='month'
                >
                  This Month
                </button>
                <button
                  className='site-button black dashboard-graph switch_panel'
                  data-date='year'
                  data-id='chart_p2p_total'
                  data-panel='year'
                >
                  This Year
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
