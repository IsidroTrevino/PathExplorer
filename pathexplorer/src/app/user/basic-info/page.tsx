"use client";

import React from "react";
import { SideBar, UserRole } from "@/components/GlobalComponents/SlideBar";

export default function BasicInfoPage() {
  return (
    <div className="flex min-h-screen">
      <SideBar role={UserRole.EMPLOYEE} />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome back, Isidro Trevino!</h1>
        <p>Fill in and verify your personal information, you can modify it whenever you want.</p>
      </div>
    </div>
  );
};

