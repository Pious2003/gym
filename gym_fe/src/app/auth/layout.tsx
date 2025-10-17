import React from 'react';
import LoginLayout from './page';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LoginLayout>{children}</LoginLayout>;
}