import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/common/header/Header';
import MainLayout from '@/components/common/layout/MainLayout';
import SessionProviderWrapper from '@/components/common/auth/SessionProviderWrapper';
import { ProvideSocketIoClient } from '@/providers/SocketIoProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='h-[100vh]'>
        <SessionProviderWrapper>
          <ProvideSocketIoClient>
            <div className='flex flex-col h-full w-full'>
              <Header />
              <div className='wrapper-page flex row'>
                <MainLayout>{children}</MainLayout>
                <ToastContainer />
              </div>
            </div>
          </ProvideSocketIoClient>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
