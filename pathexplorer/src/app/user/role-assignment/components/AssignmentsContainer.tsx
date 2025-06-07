'use client';

import React from 'react';
import { useGetPendingAssignments } from '../hooks/useGetPendingAssignments';
import { useApproveAssignment } from '../hooks/useApproveAssignment';
import { useRejectAssignment } from '../hooks/useRejectAssignment';
import { AssignmentsTable } from './AssignmentsTable';
import { ClipboardIcon } from 'lucide-react';
import EmptyView from '@/components/EmptyView';

export function AssignmentsContainer() {
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

  // Show a friendly message for both error cases and empty cases
  if ((error || (assignments && assignments.length === 0)) && !loading) {
    return (
      <EmptyView
        icon={<ClipboardIcon className="w-12 h-12 text-purple-600" />}
        message="There are no assignment requests at the moment."
      />
    );
  }

  return (
    <AssignmentsTable
      data={assignments || []}
      loading={loading || approving || rejecting}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
