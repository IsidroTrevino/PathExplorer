'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AssignmentInfoSection() {
  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="bg-white border-b pb-4">
        <CardTitle className="text-xl font-medium text-[#7500C0]">Assignment Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-1/3">
            <p className="text-sm font-medium">Assignment percentage</p>
          </div>
          <div className="w-full sm:w-2/3 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#7500C0] to-[#A055F5] h-full text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
              style={{ width: '38%' }}
            >
                            38%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
