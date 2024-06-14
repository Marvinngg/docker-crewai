"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        <Header />
        <div style={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: '#f4f4f9' }}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', marginLeft: isOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
            <button onClick={toggleSidebar} style={{
              position: 'absolute',
              top: '20px',
              left: isOpen ? '250px' : '20px',
              zIndex: 1, 
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#61dafb',
            }}>
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
