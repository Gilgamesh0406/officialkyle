'use client';
import { useEffect, useState } from 'react';
import Cart from '../asides/cart/Cart';
import Chat from '../asides/chat/Chat';
import Footer from '../footer/Footer';
import {
  changeProfileSetting,
  getProfileSettingValue,
  loadProfileSettings,
} from '@/lib/client/profile-settings';
import axios from 'axios';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [chatOpen, setChatIsOpen] = useState(false);
  const [cartOpen, setCartIsOpen] = useState(false);
  const [userIp, setUserIp] = useState('');

  console.log(userIp);

  useEffect(() => {
    loadProfileSettings();
    setChatIsOpen(getProfileSettingValue('chat') === '0' ? false : true);
    setCartIsOpen(getProfileSettingValue('cart') === '0' ? false : true);

    // Fetch IP address
    const fetchIp = async () => {
      try {
        await axios.post('/api/users/use-ip');
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    };

    fetchIp();
  }, []);
  // loadProfileSettings();
  const handleChat = (val: boolean) => {
    setChatIsOpen(val);
    changeProfileSetting('chat', val ? '1' : '0');
  };
  const handleCart = (val: boolean) => {
    setCartIsOpen(val);
    changeProfileSetting('cart', val ? '1' : '0');
  };

  return (
    <>
      <Chat onChatOpen={handleChat} chatOpen={chatOpen} />
      <div
        className='main-panel transition-5 text-center'
        style={{
          left: chatOpen ? '275px' : '0px',
          right: cartOpen ? '275px' : '0px',
        }}
      >
        <div id='page_loader'>
          <div id='page_content'>
            <div className='m-2'>{children}</div>
          </div>
        </div>
        <Footer />
      </div>
      {/* <Cart onCartOpen={handleCart} cartOpen={cartOpen} /> */}
    </>
  );
};

export default MainLayout;
