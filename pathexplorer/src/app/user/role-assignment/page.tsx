'use client';

import React from 'react';
import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { useGetPendingAssignments } from './hooks/useGetPendingAssignments';
import { useApproveAssignment } from './hooks/useApproveAssignment';
import { useRejectAssignment } from './hooks/useRejectAssignment';
import { AssignmentsTable } from './components/AssignmentsTable';
import { AlertCircleIcon } from 'lucide-react';
import EmptyView from '@/components/GlobalComponents/EmptyView';

export default function AssignmentsPage() {
  const {
    data: assignments,
    loading,
    error,
    refetch,
  } = useGetPendingAssignments();

  const { approveAssignment, loading: approving } = useApproveAssignment();

  const { rejectAssignment, loading: rejecting } = useRejectAssignment();

  const handleApprove = async (id: number) => {
    await approveAssignment(id);
    refetch();
  };

  const handleReject = async (id: number) => {
    await rejectAssignment(id);
    refetch();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y--8">
          <PageHeader
            title="Project Requests"
            subtitle="Approve and manage project requests from employees."
          />
        </div>

        {error ? (
          <EmptyView
            icon={<AlertCircleIcon className="w-12 h-12 text-purple-600" />}
            message="No soft skills added yet."
          />
        ) : (
          <AssignmentsTable
            data={assignments}
            loading={loading || approving || rejecting}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
}
