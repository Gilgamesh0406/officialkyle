import { signOut } from 'next-auth/react';
import React from 'react';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
type Props = {};

function Logout({}: Props) {
  return (
    <div
      className='pointer'
      data-modal='show'
      data-id='#modal_auth_logout'
      onClick={() => {
        Cookies.remove('session');
        Cookies.remove('userid');
        signOut();
      }}
    >
      <FontAwesomeIcon icon={faSignOut} className='fa-2x' />
    </div>
  );
}

export default Logout;
