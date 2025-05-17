'use client';

import { useState, useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineHome, HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineFingerprint, MdOutlineAnalytics, MdWorkspacePremium } from 'react-icons/md';
import { FaRegSun } from 'react-icons/fa';
import { RiTeamLine, RiFolderOpenLine } from 'react-icons/ri';
import { FaUsers } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { useUser } from '@/features/context/userContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export enum UserRole {
  DEVELOPER = 'developer',
  MANAGER = 'manager',
  TFS = 'TFS',
}

export const SideBar = () => {
  const { logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [userRole, setUserRole] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  const getActiveStateFromPath = (path: string) => {
    if (path.includes('/user/basic-info')) {
      return 'basic';
    }
    else if (path.includes('/user/role-assignment')) {
      return 'request';
    }
    else if (path.includes('/user/dashboard')) {
      return 'dashboard';
    }
    else if (path.includes('/user/profesional-path')) {
      if (path === '/user/dashboard') {
        return 'dashboard';
      } else if (path.includes('curriculum')) {
        return 'curriculum';
      } else if (path.includes('certifications')) {
        return 'certs';
      } else if (path.includes('projects')) {
        return 'projects';
      } else if (path.includes('employees')) {
        return 'employees';
      } else if (path.includes('request')) {
        return 'request';
      } else {
        return 'path';
      }
    } else if (path.includes('/user/curriculum')) {
      return 'curriculum';
    } else if (path.includes('/user/certifications')) {
      return 'certs';
    } else if (path.includes('/user/projects')) {
      return 'projects';
    } else if (path.includes('/user/employees')) {
      return 'employees';
    }
    return '';
  };

  const [active, setActive] = useState(() => getActiveStateFromPath(pathname || ''));

  useEffect(() => {
    const cookieRole = Cookies.get('userRole');

    if (cookieRole) {
      setUserRole(cookieRole);
    }

    setTimeout(() => {
      setIsInitialized(true);
    }, 300);
  }, []);

  useEffect(() => {
    if (pathname) {
      setActive(getActiveStateFromPath(pathname));
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/auth/LogIn');
  };

  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="px-4 py-3 rounded-full">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-24 h-4 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    ));
  };

  const renderItems = () => {
    const role = userRole?.toLowerCase();

    const items = [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: <HiOutlineHome />,
        path: '/user/dashboard',
      },
    ];

    if (role === 'manager' || role === UserRole.MANAGER.toLowerCase()) {
      items.push(
        { key: 'basic', label: 'Basic Information', icon: <MdOutlineFingerprint />, path: '/user/basic-info' },
        { key: 'employees', label: 'Employees', icon: <RiTeamLine />, path: '/user/employees' },
        { key: 'projects', label: 'Projects', icon: <RiFolderOpenLine />, path: '/user/projects' },
        { key: 'certs', label: 'Certifications', icon: <MdWorkspacePremium />, path: '/user/certifications' },
      );
    }
    else if (role === 'tfs' || role === UserRole.TFS.toLowerCase()) {
      items.push(
        { key: 'basic', label: 'Basic Information', icon: <MdOutlineFingerprint />, path: '/user/basic-info' },
        { key: 'request', label: 'Request', icon: <FaUsers />, path: '/user/role-assignment' },
      );
    }
    else {
      items.push(
        { key: 'basic', label: 'Basic Information', icon: <MdOutlineFingerprint />, path: '/user/basic-info' },
        { key: 'curriculum', label: 'Curriculum', icon: <HiOutlineDocumentText />, path: '/user/curriculum' },
        { key: 'path', label: 'Professional path', icon: <MdOutlineAnalytics />, path: '/user/profesional-path' },
        { key: 'certs', label: 'Certifications', icon: <MdWorkspacePremium />, path: '/user/certifications' },
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

        <nav className="flex flex-col space-y-3">
          {!isInitialized ? renderSkeletons() : renderItems()}
        </nav>
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
