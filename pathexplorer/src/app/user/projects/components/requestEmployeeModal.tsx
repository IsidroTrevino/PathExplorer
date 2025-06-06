'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestEmployee } from '../hooks/useRequestEmployee';
import { ProjectRole } from '../hooks/useGetProjectRoles';
import { Employee } from '@/app/user/projects/[projectId]/employee/[employeeId]/types/EmployeeProjectTypes';

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

  useEffect(() => {
    const resetPointerEvents = () => {
      document.body.style.pointerEvents = '';
    };

    if (!isOpen) {
      resetPointerEvents();

      const timeoutId = setTimeout(resetPointerEvents, 300);
      return () => clearTimeout(timeoutId);
    }

    return resetPointerEvents;
  }, [isOpen]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style' && !isOpen) {
          if (document.body.style.pointerEvents === 'none') {
            document.body.style.pointerEvents = '';
          }
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect();
  }, [isOpen]);

  const handleClose = () => {
    document.body.style.pointerEvents = '';
    onClose();
  };

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
      handleClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          document.body.style.pointerEvents = '';
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Employee</DialogTitle>
          <DialogDescription>
              Request {selectedEmployee?.name} {selectedEmployee?.last_name_1} for your project
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
                  <FormControl>
                    {projectRoles.length > 0 ? (
                      <Select
                        disabled={projectLoading || isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectRoles.map((role) => (
                            <SelectItem
                              key={role.role_id || `role-${Math.random()}`}
                              value={(role.role_id || '').toString()}
                            >
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center justify-center p-4 border rounded-md border-dashed bg-gray-50 text-gray-500">
                              There are no roles left for assigning
                      </div>
                    )}
                  </FormControl>
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
                      placeholder="Add any additional comments about this request"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                  Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
                disabled={isSubmitting}
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
