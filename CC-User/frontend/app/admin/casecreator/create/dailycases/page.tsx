'use client';

import Input from '@/components/ui/Input';
import { ChangeEvent, useState } from 'react';

const page = () => {
  const [formData, setFormData] = useState({
    caseName: '',
    file: '',
    level: '0',
    search: '',
    orderBy: 'Name A-Z',
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
    <div className='flex column items-center gap-2 mt-4 overflow-a'>
      <div className='width-8 responsive text-left'>
        <div className='font-10 text-bold'>Create Case</div>
      </div>

      <div className='bg-light-transparent text-left rounded-1 b-d2 p-4 width-8 responsive'>
        <div className='flex items-start column gap-2'>
          <div className='input_field transition-5' data-border='#de4c41'>
            <Input
              label='Case name'
              name='caseName'
              value={formData.caseName}
              onInput={onInput}
            />

            <div className='field_bottom'>
              <div className='field_error active' data-error='required'>
                This field is required
              </div>
            </div>
          </div>

          <div className='file_field transition-5' data-border='#de4c41'>
            <div className='field_container'>
              <div className='field_content'>
                <input
                  type='file'
                  className='field_element_input'
                  id='casecreator_case_image'
                  accept='image/*'
                  value=''
                />
                <div className='field_file'>
                  <div className='field_file_source'>
                    <img src='' />
                  </div>
                </div>

                <div className='field_label active transition-5'>
                  Case image
                </div>
              </div>

              <div className='field_extra'>
                <button className='field_element_file site-button purple width-full'>
                  Choose File
                </button>
              </div>
            </div>

            <div className='field_bottom'></div>
          </div>

          <div className='input_field transition-5' data-border='#de4c41'>
            <Input
              label='Level'
              name='level'
              value={formData.level}
              onInput={onInput}
            />
          </div>

          <div className='flex column gap-1 width-full'>
            <div className='flex row responsive gap-2'>
              <div className='input_field bet_input_field transition-5'>
                <Input
                  label='Search Item'
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
                    { value: 'Name A-Z' },
                    { value: 'Name Z-A' },
                    { value: 'Price acending' },
                    { value: 'Price descending' },
                  ]}
                />

                <div className='field_bottom'></div>
              </div>
            </div>

            <div id='casecreator_items'>
              <div className='in-grid flex justify-center items-center font-8 p-4 history_message'>
                No cases found
              </div>
            </div>

            <div className='flex items-center justify-center bg-dark p-2 rounded-0'>
              <div
                className='pagination-content flex row gap-2 width-full'
                id='pagination_casecreator_items'
              >
                <div className='flex row gap-2 justify-between items-center width-full'>
                  <div
                    className='pagination-item flex items-center justify-center'
                    data-page='1'
                  >
                    «
                  </div>

                  <div className='bg-light rounded-1 b-l2 pl-2 pr-2 flex row items-center justify-center height-full'>
                    1/1
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

            <div className='table-container'>
              <div className='table-body' id='casecreator_case_items'>
                <div className='in-grid bg-light flex justify-center items-center font-8 p-4 history_message'>
                  No items selected
                </div>
              </div>
            </div>

            <div className='flex row justify-between items-center gap-2'>
              <div className='flex row justify-center items-center gap-2'>
                <div className='bg-dark p-2 rounded-0'>
                  Total Odds: <span id='casecreator_chance'>0.00</span>%
                </div>
                <div className='bg-dark p-2 rounded-0'>
                  Case Price: <span id='casecreator_price'>N/A</span>
                </div>
              </div>

              <button
                className='site-button purple disabled'
                id='casecreator_case_create'
              >
                Create Case
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
