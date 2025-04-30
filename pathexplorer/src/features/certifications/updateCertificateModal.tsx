import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Certification } from './useGetCertifications';
import { cn } from '@/lib/utils';
import { useUpdateCertification } from './useUpdateCertification';

interface UpdateCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification: Certification | null;
}

export function UpdateCertificateModal({ isOpen, onClose, certification }: UpdateCertificateModalProps) {
  const { updateCertification, loading, error } = useUpdateCertification();

  const [formData, setFormData] = useState<{
    name: string;
    type: string;
    description: string;
    certification_date: Date | undefined;
    expiration_date: Date | undefined;
  }>({
    name: '',
    type: '',
    description: '',
    certification_date: undefined,
    expiration_date: undefined,
  });

  useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name,
        type: certification.type,
        description: certification.description,
        certification_date: certification.certification_date ? new Date(certification.certification_date) : undefined,
        expiration_date: certification.expiration_date ? new Date(certification.expiration_date) : undefined,
      });
    }
  }, [certification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certification) return;

    const success = await updateCertification(certification.certification_id, formData);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen && !!certification} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Certification</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Certificate Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Certificate Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Certification Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.certification_date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.certification_date ? (
                      format(formData.certification_date, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.certification_date}
                    onSelect={(date) => setFormData({ ...formData, certification_date: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Expiration Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.expiration_date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiration_date ? (
                      format(formData.expiration_date, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiration_date}
                    onSelect={(date) => setFormData({ ...formData, expiration_date: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
                Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#7500C0] hover:bg-[#6200a0] text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Certificate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
