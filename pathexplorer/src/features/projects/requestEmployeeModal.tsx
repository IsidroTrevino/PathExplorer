'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestEmployee } from './useRequestEmployee';
import { ProjectRole } from './useGetProjectRoles';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Employee } from '@/features/user/useGetEmployees';
import { useRouter } from 'next/navigation';

const requestSchema = z.object({
  project_role_id: z.string().min(1, 'Please select a role'),
  comments: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface RequestEmployeeModalProps {
  projectRoles: ProjectRole[];
  projectLoading: boolean;
  projectId?: string;
  selectedEmployee?: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestEmployeeModal({
  projectRoles,
  projectLoading,
  projectId,
  selectedEmployee,
  isOpen,
  onClose,
}: RequestEmployeeModalProps) {
  const { isSubmitting, requestEmployee } = useRequestEmployee();
  const { refresh } = useRouter();

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      project_role_id: '',
      comments: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        project_role_id: '',
        comments: '',
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: RequestFormValues) => {
    if (!selectedEmployee || !projectId) return;

    const success = await requestEmployee({
      developer_id: selectedEmployee.id,
      project_role_id: parseInt(data.project_role_id),
      project_id: parseInt(projectId),
      comments: data.comments,
    });

    if (success) {
      toast.success('Employee request submitted', {
        description: `${selectedEmployee.name} ${selectedEmployee.last_name_1} has been requested for this project.`,
      });
      form.reset();
      closeSafely();
      refresh();
    }
  };

  const closeSafely = () => {
    (document.activeElement as HTMLElement | null)?.blur(); // release focus
    onClose();
    refresh();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && closeSafely()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Employee</DialogTitle>
          <DialogDescription>
            {selectedEmployee && `Request ${selectedEmployee.name} ${selectedEmployee.last_name_1} for your project.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="project_role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Role</FormLabel>
                  <Select
                    disabled={projectLoading || isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role for this employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectLoading ? (
                        <SelectItem value="loading" disabled>
                                  Loading roles...
                        </SelectItem>
                      ) : projectRoles.length === 0 ? (
                        <SelectItem value="none" disabled>
                                  No available roles
                        </SelectItem>
                      ) : (
                        projectRoles.map((role) => (
                          <SelectItem key={role.role_id} value={role.role_id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional information about this request..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeSafely}>Cancel</Button>

              <Button
                type="submit"
                className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
                disabled={isSubmitting || projectLoading || projectRoles.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
