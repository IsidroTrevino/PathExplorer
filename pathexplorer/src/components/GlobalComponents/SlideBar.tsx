'use client';

import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineHome, HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineFingerprint, MdOutlineAnalytics, MdWorkspacePremium } from 'react-icons/md';
import { FaRegSun } from 'react-icons/fa';
import { RiTeamLine, RiFolderOpenLine } from 'react-icons/ri';
import { FaUsers } from 'react-icons/fa';

import Link from 'next/link';
import clsx from 'clsx';
import { useUser } from '@/features/context/userContext';
import { useRouter } from 'next/navigation';

export enum UserRole {
  DEVELOPER = 'developer',
  MANAGER = 'manager',
  TFS = 'TFS',
}

export const SideBar = () => {
  const [active, setActive] = useState('');
  const { logout, userDetails } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/LogIn');
  };

  const renderItems = () => {
    if (!userDetails) return [];

    const normalizedRole = userDetails.rol.toLowerCase();

    const items = [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: <HiOutlineHome />,
        path: '/user/profesional-path',
      },
    ];

    if (normalizedRole === UserRole.DEVELOPER) {
      items.push(
        { key: 'basic', label: 'Basic Information', icon: <MdOutlineFingerprint />, path: '/user/basic-info' },
        { key: 'curriculum', label: 'Curriculum', icon: <HiOutlineDocumentText />, path: '/user/profesional-path' },
        { key: 'path', label: 'Professional path', icon: <MdOutlineAnalytics />, path: '/user/profesional-path' },
        { key: 'certs', label: 'Certifications', icon: <MdWorkspacePremium />, path: '/user/profesional-path' }
      );
    }

    if (normalizedRole === UserRole.MANAGER) {
      items.push(
        { key: 'basic', label: 'Basic Information', icon: <MdOutlineFingerprint />, path: '/user/basic-info' },
        { key: 'employees', label: 'Employees', icon: <RiTeamLine />, path: '/user/profesional-path' },
        { key: 'projects', label: 'Projects', icon: <RiFolderOpenLine />, path: '/user/profesional-path' },
        { key: 'certs', label: 'Certifications', icon: <MdWorkspacePremium />, path: '/user/profesional-path' }
      );
    }

    if (userDetails.rol === UserRole.TFS) {
      items.push(
        { key: 'basic', label: 'Basic Information', icon: <MdOutlineFingerprint />, path: '/user/basic-info' },
        { key: 'request', label: 'Request', icon: <FaUsers />, path: '/user/profesional-path' },
      ); 
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

  if (!userDetails) return null;

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col justify-between p-4">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">PathExplorer</span>
          <FaRegSun />
        </div>

  <nav className="flex flex-col space-y-1">{renderItems()}</nav>
</div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 py-2 px-4 rounded-md hover:bg-gray-100"
      >
        <FiLogOut />
        <span>Log out</span>
      </button>
    </div>
  );
};