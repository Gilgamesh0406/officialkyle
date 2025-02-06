import React from 'react';

interface Device {
  id: number;
  device: string;
  browser: string;
  location: string;
  date: string;
}

interface MyDevicesProps {
  devices: Device[];
  onRemoveSession: (sessionId: number) => void;
}

const MyDevices: React.FC<MyDevicesProps> = ({ devices, onRemoveSession }) => {
  return (
    <div className='bg-light-transparent rounded-1 b-l2 p-2'>
      <div className='title-page flex items-center justify-center mb-2'>
        My Devices
      </div>
      <div className='table-container'>
        <div className='table-header'>
          <div className='table-row'>
            <div className='table-column text-left'>Device</div>
            <div className='table-column text-left'>Browser</div>
            <div className='table-column text-left'>Location</div>
            <div className='table-column text-left'>Date</div>
            <div className='table-column text-right'>Action</div>
          </div>
        </div>
        <div className='table-body' id='my_devices'>
          {devices.map((device) => (
            <div
              key={device.id}
              className='table-row device_session'
              data-session={device.id}
            >
              <div className='table-column text-left'>{device.device}</div>
              <div className='table-column text-left'>{device.browser}</div>
              <div className='table-column text-left'>{device.location}</div>
              <div className='table-column text-left'>{device.date}</div>
              <div className='table-column text-right'>
                <button
                  className='site-button purple remove_session'
                  onClick={() => onRemoveSession(device.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyDevices;
