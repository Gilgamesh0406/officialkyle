import { NavMenuType } from './types';

export const navigations: NavMenuType[] = [
  {
    text: 'Provably Fair',
    to: '/fair',
  },
  {
    text: 'FAQ',
    to: '/faq',
  },
  {
    text: 'Support',
    to: '/support',
  },
  {
    text: 'Leaderboard',
    to: '/leaderboard',
  },
  {
    text: 'Rewards',
    to: '/rewards',
  },
  {
    text: 'Affiliates',
    to: '/affiliates',
  },
  {
    text: 'Admin',
    to: '/admin/control',
    role: 'admin',
    textClassname: 'text-success',
  },
  {
    text: 'Dashboard',
    to: '/dashboard',
    role: 'admin',
    textClassname: 'text-success',
  },
];

export const casebattle_navs: NavMenuType[] = [
  {
    to: '/casebattle/list/active',
    text: 'Active Battles',
  },
  {
    to: '/casebattle/list/finished',
    text: 'Finished Battles',
  },
  {
    to: '/casebattle/list/my',
    text: 'My Battles',
  },
];
