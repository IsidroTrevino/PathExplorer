import { useState } from 'react';
import { Briefcase, Edit, PenSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAddFeedback } from '../hooks/useAddFeedback';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { EmployeeProject } from '../types/EmployeeTypes';

interface EmployeeProjectHistoryProps {
  projects: EmployeeProject[];
  onFeedbackUpdated?: () => void;
}

export function EmployeeProjectHistory({ projects, onFeedbackUpdated }: EmployeeProjectHistoryProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-purple-600" />
        <h2 className="text-xl font-semibold">Project History</h2>
      </div>

      <div className="relative space-y-16">
        <div className="absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-purple-300 to-purple-100 rounded-full z-0" />
        {projects.map((project, idx) => (
          <ProjectTimelineItem
            key={project.project_id}
            project={project}
            idx={idx}
            onFeedbackUpdated={onFeedbackUpdated}
          />
        ))}
      </div>
    </div>
  );
}

interface ProjectTimelineItemProps {
  project: EmployeeProject;
  idx: number;
  onFeedbackUpdated?: () => void;
}

function ProjectTimelineItem({ project, idx, onFeedbackUpdated }: ProjectTimelineItemProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState(project.feedback || '');
  const { addFeedback, isLoading, error } = useAddFeedback();

  let dateRange = 'Date not specified';
  try {
    if (project.start_date) {
      const startDate = format(parseISO(project.start_date), 'MMM d, yyyy');
      const endDate = project.end_date
        ? format(parseISO(project.end_date), 'MMM d, yyyy')
        : 'Present';
      dateRange = `${startDate} - ${endDate}`;
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }

  const handleSubmitFeedback = async () => {

    const roleId = project.role_id;

    if (!roleId) {
      toast.error('Role ID is missing. Cannot update feedback.');
      return;
    }

    const result = await addFeedback({
      roleId,
      name: project.role_name,
      description: project.role_description || '',
      feedback: feedbackText,
      project_id: project.project_id,
    });

    if (result) {
      toast.success('Feedback updated successfully');
      setIsDialogOpen(false);
      if (onFeedbackUpdated) {
        onFeedbackUpdated();
      }
    } else if (error) {
      toast.error(error);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: idx * 0.05 }}
      className="relative flex items-start gap-6 pl-16"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="absolute left-6 top-1 w-5 h-5 bg-purple-500 rounded-full border-4 border-white shadow-md z-10"
      />

      <div className="w-full">
        <div className="text-xs font-bold text-purple-600">{dateRange}</div>
        <h3 className="text-lg font-semibold text-gray-800">{project.role_name}</h3>
        <h4 className="text-sm font-medium text-purple-500">{project.project_name} - {project.client}</h4>

        {project.role_description && (
          <p className="text-sm text-gray-600 mt-1">{project.role_description}</p>
        )}

        <div className="mt-3">
          {project.feedback ? (
            <div className="p-3 bg-white rounded-md border border-gray-200 relative group">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsDialogOpen(true)}
              >
                <PenSquare className="h-4 w-4" />
              </Button>
              <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
              <p className="text-sm text-gray-600">{project.feedback}</p>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" /> Add Feedback
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {project.feedback ? 'Edit Feedback' : 'Add Feedback'} for {project.role_name}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter feedback for this role..."
              className="min-h-[150px] resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
            </Button>
            <Button onClick={handleSubmitFeedback} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
