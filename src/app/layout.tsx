import Header from '@/components/Header';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Election Stats',
  description: '',
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderWrapper>
          <Header />
          <main>{children}</main>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
