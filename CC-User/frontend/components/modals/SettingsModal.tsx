'use client';
import React, { ChangeEvent, useState } from 'react';
import Input from '../ui/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

const SettingsModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
}) => {
  if (!isOpen) return null;
  const [tab, setTab] = useState<'settings' | 'changePass'>('settings');
  const session = useSession();
  const [formData, setFormData] = useState({
    username: session.data?.user?.name,
    email: session.data?.user?.email,
    currentPassword: '',
    newPassword: '',
    passwordConfirmation: '',
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

    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const changeTab = (tabName: 'settings' | 'changePass') => {
    setTab(tabName);
    setFormData((prevData) => ({
      ...prevData,

      password: '',
      passwordConfirmation: '',
      newPassword: '',
    }));
  };

  return (
    <div
      className={`modal medium active ${
        isOpen ? 'opacity-100 z-[999]' : 'opacity-0 z-[-999]'
      }`}
      id='modal_auth'
    >
      <div className='modal-dialog flex justify-center items-center'>
        <div className='modal-content rounded-1'>
          <div className='modal-header flex items-center justify-between'>
            <div className='modal-title text-upper'>
              {tab === 'settings' ? 'Account Settings' : 'Change Password'}
            </div>
            <div
              onClick={
                tab === 'settings'
                  ? () => setIsOpen(false)
                  : () => changeTab('settings')
              }
              className='modal-close flex justify-center items-center rounded-0'
              data-modal='hide'
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>

          <div className='modal-body text-left'>
            {tab === 'settings' ? (
              <div className='switch_content' data-id='auth' data-panel='login'>
                <form
                  className='form_auth'
                  autoComplete='login'
                  method='POST'
                  action='/auth/login?return=affiliates'
                >
                  <div className='flex column items-center gap-2'>
                    <div
                      className='input_field bet_input_field transition-5'
                      data-border='#de4c41'
                    >
                      <Input
                        label='Username / E-mail'
                        name='username'
                        //@ts-ignore
                        value={formData.username}
                        onInput={onInput}
                      />

                      <div className='field_bottom'>
                        <div
                          className='field_error active'
                          data-error='required'
                        >
                          This field is required
                        </div>
                        <div
                          className='field_error'
                          data-error='username_email'
                        >
                          This field must be a username or a email
                        </div>
                      </div>
                    </div>

                    <div
                      className='input_field bet_input_field transition-5'
                      data-border='#de4c41'
                    >
                      <Input
                        label='Email'
                        name='email'
                        //@ts-ignore
                        value={formData.email}
                        onInput={onInput}
                      />

                      <div className='field_bottom'>
                        <div
                          className='field_error active'
                          data-error='required'
                        >
                          This field is required
                        </div>
                        <div className='field_error' data-error='password'>
                          At least 8 characters, one uppercase, one lowercase,
                          one number and one symbol
                        </div>
                      </div>
                    </div>

                    <div className='flex justify-start width-full mt-2'>
                      <div
                        className='text-gray pointer font-6'
                        data-modal='show'
                        onClick={() => changeTab('changePass')}
                        data-id='#modal_auth_recover'
                      >
                        Change Password
                      </div>
                    </div>

                    <button type='submit' className='site-button purple mt-1'>
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div
                className='switch_content'
                data-id='auth'
                data-panel='register'
              >
                <form
                  className='form_auth'
                  autoComplete='register'
                  method='POST'
                  action='/auth/register?return=affiliates'
                >
                  <div className='flex column items-center gap-2'>
                    <div
                      className='input_field bet_input_field transition-5'
                      data-border='#de4c41'
                    >
                      <Input
                        type='password'
                        label='Current Password'
                        name='currentPassword'
                        value={formData.currentPassword}
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
                    <div
                      className='input_field bet_input_field transition-5'
                      data-border='#de4c41'
                    >
                      <Input
                        type='password'
                        label='New Password'
                        name='newPassword'
                        value={formData.newPassword}
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
                    <div
                      className='input_field bet_input_field transition-5'
                      data-border='#de4c41'
                    >
                      <Input
                        type='password'
                        label='Confirm new Password'
                        name='passwordConfirmation'
                        value={formData.passwordConfirmation}
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

                    <button type='submit' className='site-button purple mt-1'>
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
