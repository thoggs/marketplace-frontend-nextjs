import { IconDashboard, IconBuildingStore, IconUsers } from '@tabler/icons-react';
import React, { ReactNode } from "react";

type NavLinkItem = {
  href: string;
  label: string;
  icon: ReactNode;
}

export const NAV_LINKS: NavLinkItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <IconDashboard size='1.3rem' stroke={1.5}/>,
  },
  {
    href: '/products',
    label: 'Produtos',
    icon: <IconBuildingStore size='1.3rem' stroke={1.5}/>,
  },
  {
    href: '/users',
    label: 'Usuários',
    icon: <IconUsers size='1.3rem' stroke={1.5}/>,
  },
];
