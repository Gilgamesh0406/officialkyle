import React from 'react';

const Summary = () => {
  return (
    <div
      className='switch_content dashboard-content'
      data-id='dashboard'
      data-panel='summary'
    >
      <div className='flex column gap-2 width-full mb-2'>
        <div className='dashboard-stats-grid'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='users_registed'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Users Registed
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='users_initialized'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>%
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Users Initialized
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='users_verified'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0.00</span>%
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Users Verified
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='users_online'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Users Online
            </div>
          </div>
        </div>

        <div className='dashboard-stats-grid'>
          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='tickets_count'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Tickets Count
            </div>
          </div>

          <div
            className='dashboard-stats flex column items-center justify-between pl-2 pr-2'
            data-stats='tickets_opened'
          >
            <div className='flex items-center height-full font-12'>
              <span className='stats'>0</span>%
            </div>
            <div className='pt-2 pb-2 bt-l2 text-color width-full text-space-1'>
              Tickets Opened
            </div>
          </div>
        </div>
      </div>

      <div className='grid responsive split-column-3 gap-2'>
        <div
          className='dashboard-chart flex column items-start gap-2'
          data-graph='unique_visitors'
        >
          <div className='text-color font-8'>Unique Visitors</div>
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
                id='dashboard_chart_unique_visitors'
                width='411'
                height='205'
              ></canvas>
            </div>
          </div>

          <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
            <button
              className='site-button black dashboard-graph switch_panel active'
              data-date='day'
              data-id='chart_unique_visitors'
              data-panel='day'
            >
              This Day
            </button>
            <button
              className='site-button black dashboard-graph switch_panel'
              data-date='week'
              data-id='chart_unique_visitors'
              data-panel='week'
            >
              This Week
            </button>
            <button
              className='site-button black dashboard-graph switch_panel'
              data-date='month'
              data-id='chart_unique_visitors'
              data-panel='month'
            >
              This Month
            </button>
            <button
              className='site-button black dashboard-graph switch_panel'
              data-date='year'
              data-id='chart_unique_visitors'
              data-panel='year'
            >
              This Year
            </button>
          </div>
        </div>

        <div
          className='dashboard-chart flex column items-start gap-2'
          data-graph='all_visitors'
        >
          <div className='text-color font-8'>All Visitors</div>
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
                id='dashboard_chart_all_visitors'
                width='411'
                height='205'
              ></canvas>
            </div>
          </div>

          <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
            <button
              className='site-button black dashboard-graph switch_panel active'
              data-date='day'
              data-id='chart_all_visitors'
              data-panel='day'
            >
              This Day
            </button>
            <button
              className='site-button black dashboard-graph switch_panel'
              data-date='week'
              data-id='chart_all_visitors'
              data-panel='week'
            >
              This Week
            </button>
            <button
              className='site-button black dashboard-graph switch_panel'
              data-date='month'
              data-id='chart_all_visitors'
              data-panel='month'
            >
              This Month
            </button>
            <button
              className='site-button black dashboard-graph switch_panel'
              data-date='year'
              data-id='chart_all_visitors'
              data-panel='year'
            >
              This Year
            </button>
          </div>
        </div>

        <div
          className='dashboard-chart flex column items-start gap-2'
          data-graph='users'
        >
          <div className='text-color font-8'>Users Joins</div>
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
                id='dashboard_chart_users'
                width='411'
                height='205'
              ></canvas>
            </div>
          </div>

          <div className='dashboard-select grid split-column-full width-full responsive gap-1'>
            <button
              className='site-button black dashboard-graph switch_panel active'
              data-date='day'
              data-id='chart_users'
              data-panel='day'
            >
              This Day
            </button>
            <button
              className='site-button black dashboard-graph switch_panel'
              data-date='week'
              data-id='chart_users'
              data-panel='week'
            >
              This Week
            </button>
            <button
              className='site-button black dashboard-graph switch_panel'
              data-date='month'
              data-id='chart_users'
              data-panel='month'
            >
              This Month
            </button>
            <button
              className='site-button black dashboard-graph switch_panel'
              data-date='year'
              data-id='chart_users'
              data-panel='year'
            >
              This Year
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
