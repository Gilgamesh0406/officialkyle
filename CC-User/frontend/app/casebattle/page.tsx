import { redirect } from 'next/navigation';
import React from 'react';

const page = () => {
  return redirect('/casebattle/list/active');
};

export default page;
