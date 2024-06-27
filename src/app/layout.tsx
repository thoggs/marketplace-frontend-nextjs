import '@mantine/core/styles.css';
import React from "react";
import { Inter } from 'next/font/google'
import { ColorSchemeScript } from "@mantine/core";
import RootStyleRegistry from "@/config/mantine";
import AuthSessionProvider from "@/app/providers/auth/provider";
import StoreProvider from "@/app/providers/store/provider";
import QueryProvider from "@/app/providers/query/provider";

const inter = Inter({ subsets: [ 'latin' ] })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
    <head>
      <title>Zhavia</title>
      <link rel="icon" href="/favicon.ico" sizes="any"/>
      <ColorSchemeScript defaultColorScheme='auto'/>
    </head>
    <body className={inter.className}>
    <AuthSessionProvider>
      <StoreProvider>
        <QueryProvider>
          <RootStyleRegistry>
            {children}
          </RootStyleRegistry>
        </QueryProvider>
      </StoreProvider>
    </AuthSessionProvider>
    </body>
    </html>
  )
}