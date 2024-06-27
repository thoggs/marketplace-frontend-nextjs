'use client';
import 'mantine-react-table/styles.css';
import '@mantine/charts/styles.css';
import {
  MantineProvider,
  AppShell,
  Stack, Box,
} from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import React from 'react';
import { RootLayoutProps } from '@/config/mantine/types';
import { Metadata } from 'next';
import { theme } from './theme';
import classes from './styles.module.scss'
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/config/app/navlinks";
import ZhToaster from '@/shared/components/ZhToaster';
import ZhHeader from '@/shared/components/ZhHeader';
import ZhAutoNavLinks from '@/shared/components/ZhNavLink';

export let metadata: Metadata = {
  title: 'Zhavia - Thiago Rodrigues',
}

export default function RootStyleRegistry({ children }: RootLayoutProps) {
  const [ mobileOpened, { toggle: toggleMobile } ] = useDisclosure();
  const [ desktopOpened, { toggle: toggleDesktop } ] = useDisclosure(true);
  const pathname = usePathname();

  return (
    <MantineProvider theme={theme} defaultColorScheme='auto'>
      <ZhToaster/>
      {![ '/auth/signin', '/auth/signup' ].includes(pathname) ? (
        <AppShell
          className={classes.appShell}
          header={{ height: 64, offset: true }}
          navbar={{
            width: 250,
            breakpoint: 'sm',
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}>
          <AppShell.Header className={classes.header}>
            <ZhHeader
              mobileOpened={mobileOpened}
              desktopOpened={desktopOpened}
              toggleMobile={toggleMobile}
              toggleDesktop={toggleDesktop}
            />
          </AppShell.Header>
          <AppShell.Navbar py='lg' px='xs'>
            <Stack
              h='100%'
              align='stretch'
              justify='space-between'>
              <Box>
                <ZhAutoNavLinks links={NAV_LINKS}/>
              </Box>
            </Stack>
          </AppShell.Navbar>
          <AppShell.Main>
            <Box p='xl'>
              {children}
            </Box>
          </AppShell.Main>
        </AppShell>
      ) : (children)}
    </MantineProvider>
  )
}
