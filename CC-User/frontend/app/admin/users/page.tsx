'use client';

import Input from '@/components/ui/Input';
import { ChangeEvent, useState } from 'react';

const page = () => {
  const [formData, setFormData] = useState({
    orderBy: 'Registered date',
    search: '',
  });

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
      <div className='flex gap-1'>
        <div className='input_field transition-5' data-border='#de4c41'>
          <Input
            label='Search User (userid, username, name, ip)'
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
            dropdownData={[
              { value: 'Registered date' },
              { value: 'Name A-Z' },
              { value: 'Name Z-A' },
              { value: 'Balance acending' },
              { value: 'Balance descending' },
              { value: 'Rank' },
            ]}
            activeVal={formData.orderBy}
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
            <div className='table-column text-left'>Rank</div>
            <div className='table-column text-left'>Registed date</div>
            <div className='table-column text-right'>Action</div>
          </div>
        </div>
        <div className='table-body' id='admin_users_list'>
          <div className='table-row'>
            <div className='table-column text-left'>
              <div className='flex items-center gap-1'>
                <div className='avatar-field rounded-full  tier-steel relative'>
                  <img
                    className='avatar icon-small rounded-full'
                    src='https://crazycargo.gg/template/img/avatar.jpg'
                  />
                  <div className='level sup-small-left flex justify-center items-center b-d2 bg-dark rounded-full'>
                    0
                  </div>
                </div>
                <div className='text-left width-full ellipsis'>mykola</div>
              </div>
            </div>
            <div
              className='table-column text-left pointer'
              data-copy='text'
              data-text='7bf3af0a699ffe55e7795247'
            >
              7bf3af0a699ffe55e7795247
            </div>
            <div className='table-column text-left'>0.00$</div>
            <div className='table-column text-left text-bold chat-link-member'>
              MEMBER
            </div>
            <div className='table-column text-left'>
              24 April 2024, 06:09 AM
            </div>
            <div className='table-column text-right'>
              <a href='/admin/users/7bf3af0a699ffe55e7795247'>
                <button className='site-button purple'>Moderate</button>
              </a>
            </div>
          </div>
          <div className='table-row'>
            <div className='table-column text-left'>
              <div className='flex items-center gap-1'>
                <div className='avatar-field rounded-full  tier-steel relative'>
                  <img
                    className='avatar icon-small rounded-full'
                    src='https://crazycargo.gg/template/img/avatar.jpg'
                  />
                  <div className='level sup-small-left flex justify-center items-center b-d2 bg-dark rounded-full'>
                    0
                  </div>
                </div>
                <div className='text-left width-full ellipsis'>codeguy</div>
              </div>
            </div>
            <div
              className='table-column text-left pointer'
              data-copy='text'
              data-text='27157d4642ba4b6e4ac03bdb'
            >
              27157d4642ba4b6e4ac03bdb
            </div>
            <div className='table-column text-left'>0.00$</div>
            <div className='table-column text-left text-bold chat-link-member'>
              MEMBER
            </div>
            <div className='table-column text-left'>
              29 April 2024, 08:43 AM
            </div>
            <div className='table-column text-right'>
              <a href='/admin/users/27157d4642ba4b6e4ac03bdb'>
                <button className='site-button purple'>Moderate</button>
              </a>
            </div>
          </div>
          <div className='table-row'>
            <div className='table-column text-left'>
              <div className='flex items-center gap-1'>
                <div className='avatar-field rounded-full  tier-steel relative'>
                  <img
                    className='avatar icon-small rounded-full'
                    src='https://crazycargo.gg/template/img/avatar.jpg'
                  />
                  <div className='level sup-small-left flex justify-center items-center b-d2 bg-dark rounded-full'>
                    0
                  </div>
                </div>
                <div className='text-left width-full ellipsis'>giorgi225</div>
              </div>
            </div>
            <div
              className='table-column text-left pointer'
              data-copy='text'
              data-text='1d0e0b228bc45ec26a07fd57'
            >
              1d0e0b228bc45ec26a07fd57
            </div>
            <div className='table-column text-left'>0.00$</div>
            <div className='table-column text-left text-bold chat-link-member'>
              MEMBER
            </div>
            <div className='table-column text-left'>02 May 2024, 08:34 PM</div>
            <div className='table-column text-right'>
              <a href='/admin/users/1d0e0b228bc45ec26a07fd57'>
                <button className='site-button purple'>Moderate</button>
              </a>
            </div>
          </div>
        </div>
        <div className='table-footer'>
          <div className='flex items-center justify-center bg-dark p-2'>
            <div
              className='pagination-content flex row gap-2'
              id='pagination_admin_users'
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
  );
};

export default page;
