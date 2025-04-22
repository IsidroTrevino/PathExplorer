'use client';

import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineHome, HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineFingerprint, MdOutlineAnalytics, MdWorkspacePremium } from 'react-icons/md';
import { FaRegSun } from 'react-icons/fa';
import { RiTeamLine, RiFolderOpenLine } from 'react-icons/ri';
import { FaUsers } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

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
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      if (pathname.includes('/user/basic-info')) {
        setActive('basic');
      } else if (pathname.includes('/user/profesional-path')) {
        if (pathname === '/user/profesional-path') {
          setActive('dashboard');
        } else if (pathname.includes('curriculum')) {
          setActive('curriculum');
        } else if (pathname.includes('certifications')) {
          setActive('certs');
        } else if (pathname.includes('projects')) {
          setActive('projects');
        } else if (pathname.includes('employees')) {
          setActive('employees');
        } else if (pathname.includes('request')) {
          setActive('request');
        } else {
          setActive('path');
        }
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/auth/LogIn');
  };

  const renderItems = () => {
    if (!userDetails) return [];

    const normalizedRole = userDetails.role.toLowerCase();

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
        { key: 'curriculum', label: 'Curriculum', icon: <HiOutlineDocumentText />, path: '/user/curriculum' },
        { key: 'path', label: 'Professional path', icon: <MdOutlineAnalytics />, path: '/user/profesional-path' },
        { key: 'certs', label: 'Certifications', icon: <MdWorkspacePremium />, path: '/user/profesional-path' },
      );
    }

    if (normalizedRole === UserRole.MANAGER) {
      items.push(
        { key: 'basic', label: 'Basic Information', icon: <MdOutlineFingerprint />, path: '/user/basic-info' },
        { key: 'employees', label: 'Employees', icon: <RiTeamLine />, path: '/user/profesional-path' },
        { key: 'projects', label: 'Projects', icon: <RiFolderOpenLine />, path: '/user/profesional-path' },
        { key: 'certs', label: 'Certifications', icon: <MdWorkspacePremium />, path: '/user/profesional-path' },
      );
    }

    if (userDetails.role === UserRole.TFS) {
      items.push(
        { key: 'basic', label: 'Basic Information', icon: <MdOutlineFingerprint />, path: '/user/basic-info' },
        { key: 'request', label: 'Request', icon: <FaUsers />, path: '/user/profesional-path' },
      );
    }

    return items.map((item) => (
      <Link key={item.key} href={item.path}>
        <div
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer transition-all',
            active === item.key
              ? 'bg-purple-500 text-white'
              : 'hover:bg-gray-100 text-gray-700',
          )}
          onClick={() => setActive(item.key)}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
      </Link>
    ));
  };

  if (!userDetails) return null;

  return (
    <div className="w-64 h-screen bg-white shadow-lg flex flex-col justify-between p-6 rounded-r-xl">
      <div className="space-y-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center">
            <Image
              src="/accenture/Acc_GT_Solid_P1_RGB.png"
              alt="logo-accenture"
              width={22}
              height={22}
              className="mr-2"
            />
            <span className="font-bold text-lg">PathExplorer</span>
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <FaRegSun className="text-gray-600" />
          </div>
        </div>

        <nav className="flex flex-col space-y-3">{renderItems()}</nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-sm cursor-pointer hover:opacity-80 py-3 px-4 rounded-full hover:bg-gray-100 text-gray-700 mt-4"
      >
        <FiLogOut />
        <span>Log out</span>
      </button>
    </div>
  );
};
