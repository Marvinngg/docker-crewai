// components/Sidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Import icons from react-icons

const Sidebar: React.FC<{ isOpen: boolean, toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside className={`transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-500 to-purple-600 shadow-lg z-50`}>
        <div className="flex items-center justify-between p-4">
          <h2 className="text-white text-2xl font-bold tracking-tight">Menu</h2>
          <button onClick={toggleSidebar} className="text-white text-2xl">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        <nav>
          <ul className="mt-8 space-y-4">
            <li>
              <Link href="/" className="block text-white text-lg font-medium hover:text-gray-300 transition duration-200">公司职业搜索Agent</Link>
            </li>
            <li>
              <Link href="/page1" className="block text-white text-lg font-medium hover:text-gray-300 transition duration-200">公司行业分析Agent</Link>
            </li>
            <li>
              <Link href="/page2" className="block text-white text-lg font-medium hover:text-gray-300 transition duration-200">旅行助手Agent</Link>
            </li>
            <li>
              <Link href="/page3" className="block text-white text-lg font-medium hover:text-gray-300 transition duration-200">数据库和运行记录</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
