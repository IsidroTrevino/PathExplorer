'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCertificate } from '@/features/certifications/useCreateCertificate';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CreateCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCertificateModal({ isOpen, onClose }: CreateCertificateModalProps) {
  const [certDateOpen, setCertDateOpen] = useState(false);
  const [expDateOpen, setExpDateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    certification_date: '',
    expiration_date: '',
  });
  const { createCertificate, loading, error } = useCreateCertificate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, date: Date) => {
    setFormData(prev => ({
      ...prev,
      [name]: format(date, 'yyyy-MM-dd'),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCertificate(formData);
      onClose();
      setFormData({
        name: '',
        type: '',
        description: '',
        certification_date: '',
        expiration_date: '',
      });
    } catch (err) {
      // Error is handled in the hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#7500C0]">
              Add New Certificate
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Certificate Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter certificate name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Certificate Type</Label>
            <Input
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Enter certificate type"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter certificate description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="certification_date">Certification Date</Label>
              <Popover open={certDateOpen} onOpenChange={setCertDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="certification_date"
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !formData.certification_date && 'text-muted-foreground',
                    )}
                  >
                    {formData.certification_date ? (
                      format(new Date(formData.certification_date), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.certification_date ? new Date(formData.certification_date) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        handleDateChange('certification_date', date);
                        setCertDateOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiration_date">Expiration Date</Label>
              <Popover open={expDateOpen} onOpenChange={setExpDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="expiration_date"
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !formData.expiration_date && 'text-muted-foreground',
                    )}
                  >
                    {formData.expiration_date ? (
                      format(new Date(formData.expiration_date), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expiration_date ? new Date(formData.expiration_date) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        handleDateChange('expiration_date', date);
                        setExpDateOpen(false);
                      }
                    }}
                    initialFocus
                    disabled={(date) => {
                      return formData.certification_date ?
                        date < new Date(formData.certification_date) :
                        date < new Date();
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
                Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#7500C0] hover:bg-[#6200a0] text-white"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Certificate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
