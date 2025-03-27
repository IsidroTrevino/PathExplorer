'use client';

import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineHome, HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineFingerprint, MdOutlineAnalytics, MdWorkspacePremium } from 'react-icons/md';
import { FaRegSun } from 'react-icons/fa';
import Link from 'next/link';
import clsx from 'clsx';

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  TF = 'tf',
}

interface SideBarProps {
  role: UserRole;
}

export const SideBar = ({ role }: SideBarProps) => {
  const [active, setActive] = useState('basic');

  const baseItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <HiOutlineHome />, path: '/dashboard' },
    { key: 'basic', label: 'Basic Information', icon: <MdOutlineFingerprint />, path: '/basic' },
    { key: 'curriculum', label: 'Curriculum', icon: <HiOutlineDocumentText />, path: '/curriculum' },
    { key: 'path', label: 'Professional path', icon: <MdOutlineAnalytics />, path: '/path' },
    { key: 'certs', label: 'Certifications', icon: <MdWorkspacePremium />, path: '/certifications' },
  ];

  const managerItems = [
    { key: 'team', label: 'Team Overview', icon: <HiOutlineHome />, path: '/manager/team' },
  ];

  const tfItems = [
    { key: 'admin', label: 'Admin Panel', icon: <HiOutlineHome />, path: '/tf/admin' },
  ];

  const renderItems = () => {
    const items = [...baseItems];

    if (role === UserRole.MANAGER) {
      items.push(...managerItems);
    }

    if (role === UserRole.TF) {
      items.push(...tfItems);
    }

    return items.map((item) => (
      <Link key={item.key} href={item.path}>
        <div
          className={clsx(
            'flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-all',
            active === item.key
              ? 'bg-purple-500 text-white'
              : 'hover:bg-gray-100 text-black',
          )}
          onClick={() => setActive(item.key)}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
      </Link>
    ));
  };

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col justify-between p-4">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">PathExplorer</span>
          <FaRegSun />
        </div>

        <nav className="flex flex-col space-y-1">{renderItems()}</nav>
      </div>

      <div className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
        <FiLogOut />
        <span>Log out</span>
      </div>
    </div>
  );
};
