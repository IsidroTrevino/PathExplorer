import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export function EmployeeProfileSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 overflow-y-auto">
      <div className="mb-4 h-9">
        <Button variant="ghost" className="opacity-60 pointer-events-none" disabled>
          <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Employees
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-5 shadow-sm mb-6 animate-pulse w-full">
        <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
          <div className="h-20 w-20 rounded-full bg-gray-200"></div>
          <div className="w-full">
            <div className="h-8 bg-gray-200 rounded-md w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
          </div>
        </div>
      </div>

      <div className="space-y-6 w-full">
        <div className="bg-white rounded-lg border p-5 shadow-sm animate-pulse w-full">
          <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
          <div className="space-y-3 w-full">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded-full mr-2 flex-shrink-0"></div>
              <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded-full mr-2 flex-shrink-0"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded-full mr-2 flex-shrink-0"></div>
              <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t w-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-5 w-5 bg-gray-200 rounded-md"></div>
              <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
            </div>
            <div className="relative pl-4 w-full">
              <div className="absolute top-0 bottom-0 left-2 w-1 bg-gray-200 rounded-full"></div>
              <div className="relative flex items-start gap-4 pl-6 pb-1 w-full">
                <div className="absolute left-0 top-2 w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="bg-gray-100 rounded-lg p-3 w-full">
                  <div className="h-3 bg-gray-200 rounded-md w-1/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-2"></div>
                  <div className="h-4 w-1/4 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm animate-pulse w-full">
          <div className="h-6 bg-gray-200 rounded-md w-1/5 mb-4"></div>

          <div className="space-y-6 w-full">
            <div>
              <div className="h-5 bg-gray-200 rounded-md w-1/4 mb-3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {[...Array(6)].map((_, i) => (
                  <div key={`hard-${i}`} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full w-full mt-2"></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="h-5 bg-gray-200 rounded-md w-1/4 mb-3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {[...Array(4)].map((_, i) => (
                  <div key={`soft-${i}`} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full w-full mt-2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm animate-pulse w-full">
          <div className="p-4 border-b">
            <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
          </div>

          <div className="max-h-[500px] w-full">
            {[...Array(3)].map((_, i) => (
              <div key={`cert-${i}`} className="p-4 border-b">
                <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-md w-3/4"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm animate-pulse w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded-md"></div>
              <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
            </div>
            <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
          </div>

          <div className="relative w-full">
            <div className="w-full h-[400px] bg-gray-100"></div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
