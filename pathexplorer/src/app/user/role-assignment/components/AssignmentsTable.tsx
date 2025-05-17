"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
import { Assignment } from "../types/assignment";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface AssignmentsTableProps {
  data: Assignment[];
  loading?: boolean;
  error?: string | null;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export const AssignmentsTable = ({
  data,
  loading = false,
  onApprove,
  onReject,
}: AssignmentsTableProps) => {
  return (
    <div className="flex flex-col rounded-md border max-h-[calc(100vh-200px)]">
      <div className="overflow-y-auto flex-grow px-1 pb-6">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Employee's name</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={`loading-${index}`} className="animate-pulse">
                  <TableCell>
                    <Skeleton className="h-6 w-32 bg-purple-200 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-28 bg-gray-200 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-40 bg-gray-200 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24 bg-gray-200 rounded-md" />
                  </TableCell>
                  <TableCell className="flex gap-2 justify-center py-4">
                    <Skeleton className="h-8 w-8 rounded-md bg-gray-300" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ?  (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  There are no pending requests
                </TableCell>
              </TableRow>
            ) : (
              data.map((a) => (
                <TableRow key={a.assignment_id}>
                  <TableCell>
                    <Badge className="bg-purple-100 text-purple-800 font-medium px-3 py-1 rounded-full">
                      {a.developer_name}
                    </Badge>
                  </TableCell>
                  <TableCell>{a.project_name || "N/A"}</TableCell>
                  <TableCell>{a.comments}</TableCell>
                  <TableCell>
                    {new Date(a.request_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-green-600 cursor-pointer"
                          onClick={() => onApprove(a.assignment_id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onClick={() => onReject(a.assignment_id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" /> Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};