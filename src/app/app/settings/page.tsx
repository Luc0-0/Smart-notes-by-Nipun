'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [selectedTheme, setSelectedTheme] = useState('');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'aurora';
    setSelectedTheme(storedTheme);
    document.documentElement.className = storedTheme;
  }, []);

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  };
  
  const ThemeButton = ({ theme, icon, label }: { theme: string; icon: React.ReactNode; label: string; }) => (
    <button
      onClick={() => handleThemeChange(theme)}
      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg w-32 h-32 transition-all ${
        selectedTheme === theme ? 'border-primary shadow-lg scale-105' : 'border-border'
      }`}
    >
      {icon}
      <span className="mt-2 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences.</p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose the theme for your application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-start gap-4">
            <ThemeButton theme="light" icon={<Sun className="w-8 h-8" />} label="Light" />
            <ThemeButton theme="dark" icon={<Moon className="w-8 h-8" />} label="Dark" />
            <ThemeButton theme="aurora" icon={<Sparkles className="w-8 h-8 text-primary" />} label="Aurora" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
