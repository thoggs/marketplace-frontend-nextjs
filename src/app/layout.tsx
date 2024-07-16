import '@mantine/core/styles.css';
import React from "react";
import { Inter } from 'next/font/google'
import { ColorSchemeScript } from "@mantine/core";
import RootStyleRegistry from "@/config/mantine";
import AuthSessionProvider from "@/app/providers/auth/provider";
import QueryProvider from "@/app/providers/query/provider";
import DataProvider from "@/app/providers/data/provider";

const inter = Inter({ subsets: [ 'latin' ] })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
    <head>
      <title>CodeSumn Marketplace</title>
      <link rel="icon" href="/favicon.ico" sizes="any"/>
      <ColorSchemeScript defaultColorScheme='auto'/>
    </head>
    <body className={inter.className}>
    <AuthSessionProvider>
      <DataProvider>
        <QueryProvider>
          <RootStyleRegistry>
            {children}
          </RootStyleRegistry>
        </QueryProvider>
      </DataProvider>
    </AuthSessionProvider>
    </body>
    </html>
  )
}