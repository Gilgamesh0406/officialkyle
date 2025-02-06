'use client';

import { useState } from 'react';

const Games = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className='switch_content' data-id='dashboard' data-panel='games'>
      <div className='grid split-column-full responsive gap-1 mb-2'>
        <button
          onClick={() => setActiveTab(1)}
          className='site-button black switch_panel dashboard-load active'
          data-id='games_dashboard'
          data-panel='summary'
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className='site-button black switch_panel dashboard-load'
          data-id='games_dashboard'
          data-panel='coinflip'
        >
          Coinflip
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className='site-button black switch_panel dashboard-load'
          data-id='games_dashboard'
          data-panel='unboxing'
        >
          Unboxing
        </button>
        <button
          onClick={() => setActiveTab(4)}
          className='site-button black switch_panel dashboard-load'
          data-id='games_dashboard'
          data-panel='casebattle'
        >
          Case Battle
        </button>
        <button
          onClick={() => setActiveTab(5)}
          className='site-button black switch_panel dashboard-load'
          data-id='games_dashboard'
          data-panel='plinko'
        >
          Plinko
        </button>
      </div>

      <div
        className={`${activeTab === 1 ? '' : 'hidden'} switch_content dashboard-content`}
        data-id='games_dashboard'
        data-panel='summary'
      >
        <div className='dashboard-stats-grid mb-2'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='total_bets'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Bets
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='total_winnings'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Winnings
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='total_profit'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Profit
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='count_games'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Games
            </div>
          </div>
        </div>

        <div className='grid responsive split-column-2 gap-2'>
          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='count_games'
          >
            <div className='text-color font-8'>Games</div>
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
                <iframe className='chartjs--iframe'></iframe>
                <canvas
                  id='dashboard_chart_count_games'
                  width='778'
                  height='388'
                ></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_count_games'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_count_games'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_count_games'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_count_games'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>

          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='total_profit'
          >
            <div className='text-color font-8'>Profit</div>
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
                <iframe className='chartjs--iframe'></iframe>
                <canvas
                  id='dashboard_chart_total_profit'
                  width='778'
                  height='388'
                ></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_total_profit'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_total_profit'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_total_profit'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_total_profit'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${activeTab === 2 ? '' : 'hidden'} switch_content dashboard-content`}
        data-id='games_dashboard'
        data-panel='coinflip'
      >
        <div className='dashboard-stats-grid mb-2'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='coinflip_total_bets'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Bets
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='coinflip_total_winnings'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Winnings
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='coinflip_total_profit'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Profit
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='coinflip_count_games'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Games
            </div>
          </div>
        </div>

        <div className='grid responsive split-column-2 gap-2'>
          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='coinflip_games'
          >
            <div className='text-color font-8'>Coinflip Games</div>
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
                <canvas id='dashboard_chart_coinflip_games'></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_coinflip_games'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_coinflip_games'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_coinflip_games'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_coinflip_games'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>

          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='coinflip_profit'
          >
            <div className='text-color font-8'>Coinflip Profit</div>
            <div className='width-full relative'>
              <div className='dashboard-loader  bg-light-transparent flex justify-center items-center'>
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
                <canvas id='dashboard_chart_coinflip_profit'></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_coinflip_profit'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_coinflip_profit'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_coinflip_profit'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_coinflip_profit'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${activeTab === 3 ? '' : 'hidden'} switch_content dashboard-content`}
        data-id='games_dashboard'
        data-panel='unboxing'
      >
        <div className='dashboard-stats-grid mb-2'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='unboxing_total_bets'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Bets
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='unboxing_total_winnings'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Winnings
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='unboxing_total_profit'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Profit
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='unboxing_count_games'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Games
            </div>
          </div>
        </div>

        <div className='grid responsive split-column-2 gap-2'>
          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='unboxing_games'
          >
            <div className='text-color font-8'>Unboxing Games</div>
            <div className='width-full relative'>
              <div className='dashboard-loader  bg-light-transparent flex justify-center items-center'>
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
                <canvas id='dashboard_chart_unboxing_games'></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_unboxing_games'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_unboxing_games'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_unboxing_games'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_unboxing_games'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>

          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='unboxing_profit'
          >
            <div className='text-color font-8'>Unboxing Profit</div>
            <div className='width-full relative'>
              <div className='dashboard-loader  bg-light-transparent flex justify-center items-center'>
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
                <canvas id='dashboard_chart_unboxing_profit'></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_unboxing_profit'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_unboxing_profit'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_unboxing_profit'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_unboxing_profit'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${activeTab === 4 ? '' : 'hidden'} switch_content dashboard-content`}
        data-id='games_dashboard'
        data-panel='casebattle'
      >
        <div className='dashboard-stats-grid mb-2'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='casebattle_total_bets'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Bets
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='casebattle_total_winnings'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Winnings
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='casebattle_total_profit'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Profit
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='casebattle_count_games'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Games
            </div>
          </div>
        </div>

        <div className='grid responsive split-column-2 gap-2'>
          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='casebattle_games'
          >
            <div className='text-color font-8'>Case Battle Games</div>
            <div className='width-full relative'>
              <div className='dashboard-loader  bg-light-transparent flex justify-center items-center'>
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
                <canvas id='dashboard_chart_casebattle_games'></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_casebattle_games'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_casebattle_games'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_casebattle_games'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_casebattle_games'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>

          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='casebattle_profit'
          >
            <div className='text-color font-8'>Case Battle Profit</div>
            <div className='width-full relative'>
              <div className='dashboard-loader  bg-light-transparent flex justify-center items-center'>
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
                <canvas id='dashboard_chart_casebattle_profit'></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_casebattle_profit'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_casebattle_profit'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_casebattle_profit'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_casebattle_profit'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${activeTab === 5 ? '' : 'hidden'} switch_content dashboard-content`}
        data-id='games_dashboard'
        data-panel='plinko'
      >
        <div className='dashboard-stats-grid mb-2'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='plinko_total_bets'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Bets
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='plinko_total_winnings'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Winnings
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='plinko_total_profit'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>$
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Total Profit
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='plinko_count_games'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Games
            </div>
          </div>
        </div>

        <div className='grid responsive split-column-2 gap-2'>
          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='plinko_games'
          >
            <div className='text-color font-8'>Plinko Games</div>
            <div className='width-full relative'>
              <div className='dashboard-loader  bg-light-transparent flex justify-center items-center'>
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
                <canvas id='dashboard_chart_plinko_games'></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_plinko_games'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_plinko_games'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_plinko_games'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_plinko_games'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>

          <div
            className='dashboard-chart flex column items-start gap-2'
            data-graph='plinko_profit'
          >
            <div className='text-color font-8'>Plinko Profit</div>
            <div className='width-full relative'>
              <div className='dashboard-loader  bg-light-transparent flex justify-center items-center'>
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
                <canvas id='dashboard_chart_plinko_profit'></canvas>
              </div>
            </div>

            <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
              <button
                className='site-button black dashboard-graph switch_panel active'
                data-date='day'
                data-id='chart_plinko_profit'
                data-panel='day'
              >
                This Day
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='week'
                data-id='chart_plinko_profit'
                data-panel='week'
              >
                This Week
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='month'
                data-id='chart_plinko_profit'
                data-panel='month'
              >
                This Month
              </button>
              <button
                className='site-button black dashboard-graph switch_panel'
                data-date='year'
                data-id='chart_plinko_profit'
                data-panel='year'
              >
                This Year
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
