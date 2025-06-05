'use client';

import React from 'react';
import CurriculumUpload from './CurriculumUpload';

export default function CurriculumUploadSection() {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <CurriculumUpload />
      </div>
      <p className="text-sm text-gray-500 italic">
                Upload your CV in PDF format.
      </p>
    </section>
  );
}
