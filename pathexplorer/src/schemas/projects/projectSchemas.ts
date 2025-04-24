import { z } from 'zod';

export const projectSchema = z.object({
  projectName: z.string().min(3, { message: 'Project title must be at least 3 characters' }),
  client: z.string().min(2, { message: 'Client name must be at least 2 characters' }),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'Estimated delivery date is required' }),
  employees_req: z.number().int().positive({ message: 'Number of employees must be positive' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  createdBy: z.string().optional(),
}).refine(
  (data) => !data.startDate || !data.endDate || data.startDate <= data.endDate,
  {
    message: 'Start date cannot be after the delivery date',
    path: ['startDate'],
  },
);

export type ProjectFormData = z.infer<typeof projectSchema>;
