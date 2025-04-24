'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Project } from './useGetProjects';
import { useEditProject } from './useEditProject';
import { useDeleteProject } from './useDeleteProject';
import { toast } from 'sonner';
import { useConfirm } from '@/features/hooks/useConfirm';

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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { projectSchema } from '@/schemas/projects/projectSchemas';

type ProjectFormValues = z.infer<typeof projectSchema>;

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess: () => void;
}

export function EditProjectModal({ isOpen, onClose, project, onSuccess }: EditProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const { editProject } = useEditProject();
  const { deleteProject, isLoading: isDeleteLoading } = useDeleteProject();
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete Project',
    'Are you sure you want to delete this project? This action cannot be undone.',
  );

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      client: '',
      startDate: new Date(),
      endDate: new Date(),
      employees_req: 1,
      description: '',
    },
  });

  useEffect(() => {
    if (project && isOpen) {
      form.reset({
        projectName: project.projectName,
        client: project.client,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
        employees_req: project.employees_req,
        description: project.description,
      });
    }
  }, [project, isOpen, form]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!project) return;

    setIsSubmitting(true);
    try {
      const success = await editProject({
        id: project.id,
        projectName: data.projectName,
        client: data.client,
        startDate: data.startDate,
        endDate: data.endDate,
        employees_req: data.employees_req,
        description: data.description,
      });

      if (success) {
        toast.success('Project updated', {
          description: 'Your project has been updated successfully.',
        });
        form.reset();
        onClose();
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Error', {
        description: 'Failed to update project. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    const confirmed = await confirm();

    if (confirmed) {
      try {
        const success = await deleteProject(project.id);
        if (success) {
          toast.success('Project deleted', {
            description: 'Your project has been deleted successfully.',
          });
          onClose();
          onSuccess();
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Error', {
          description: 'Failed to delete project. Please try again.',
        });
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[700px] z-50">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project details below.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 z-[9999]"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setStartDateOpen(false);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Estimated Delivery Date</FormLabel>
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 z-[9999]"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setEndDateOpen(false);
                              }
                            }}
                            disabled={(date) => date < form.getValues('startDate')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="employees_req"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees Required</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the project..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-0 flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting || isDeleteLoading}
                >
                  {isDeleteLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                    </>
                  ) : (
                    'Delete Project'
                  )}
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting || isDeleteLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
                    disabled={isSubmitting || isDeleteLoading}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                      </>
                    ) : (
                      'Update Project'
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </>
  );
}
