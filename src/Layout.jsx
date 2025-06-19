import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen bg-background overflow-hidden">
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;