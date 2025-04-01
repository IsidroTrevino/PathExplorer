'use client';

import React from 'react';
import { SideBar, UserRole } from '@/components/GlobalComponents/SlideBar';
import { Input } from '@/components/ui/input';

export default function BasicInfoPage() {
  return (
    <div className="flex min-h-screen">
      <SideBar role={UserRole.EMPLOYEE} />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome back, Isidro Trevino!</h1>
        <p>Fill in and verify your personal information, you can modify it whenever you want.</p>

        <div className="pt-6 pr-96 flex-col space-y-6">

          <div className='flex items-center gap-40'>
            <h1 className='text-l font-semibold w-[300px]'>Name</h1>
            <Input type="text" placeholder='Full name'></Input>
          </div>

          <div className='flex items-center gap-40'>
            <h1 className='text-l font-semibold w-[300px]'>E-mail</h1>
            <Input type="text" placeholder='Personal mail'></Input>
          </div>

          <div className='flex items-center gap-40'>
            <h1 className='text-l font-semibold  w-[300px]'>Position</h1>
            <Input type="text" placeholder='Position (dropDOWN)'></Input>
          </div>

          <div className='flex items-center gap-40'>
            <h1 className='text-l font-semibold  w-[300px]'>Seniority</h1>
            <Input type="text" placeholder='Seniority'></Input>
          </div>

          <div className='flex items-center gap-40'>
            <h1 className='text-l font-semibold  w-[300px]'>Department/Role</h1>
            <Input type="text" placeholder='Department/role'></Input>
          </div>

          <div className='flex items-center gap-40'>
            <h1 className='text-l font-bold  w-[300px]'>Assignment percentage</h1>
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
              <div className="bg-[#A055F5] text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: '38%'}}> 38%</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

