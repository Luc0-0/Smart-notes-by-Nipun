'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function OnboardingWizard() {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState('aurora');

  useEffect(() => {
    const timer = setTimeout(() => {
        const hasOnboarded = localStorage.getItem('onboarded');
        if (!hasOnboarded) {
             setIsOpen(true);
        }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    setTheme(selectedTheme);
    localStorage.setItem('onboarded', 'true');
    setIsOpen(false);
  };

  const ThemeButton = ({ theme, icon, label } : { theme: string; icon: React.ReactNode; label: string;}) => (
    <button
      onClick={() => setSelectedTheme(theme)}
      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg w-28 h-28 transition-all ${
        selectedTheme === theme ? 'border-primary shadow-lg' : 'border-border'
      }`}
    >
      {icon}
      <span className="mt-2 font-medium">{label}</span>
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Welcome to Elevated Notes!</DialogTitle>
          <DialogDescription>
            Let's get you set up in just a few clicks.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {step === 1 && (
            <div>
              <h3 className="font-semibold mb-4">Choose your theme</h3>
              <div className="flex justify-center gap-4">
                <ThemeButton theme="light" icon={<Sun className="w-8 h-8" />} label="Light" />
                <ThemeButton theme="dark" icon={<Moon className="w-8 h-8" />} label="Dark" />
                <ThemeButton theme="aurora" icon={<Sparkles className="w-8 h-8 text-primary" />} label="Aurora" />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleFinish} className="w-full">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
