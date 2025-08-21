'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit } from 'lucide-react';

type AuthFormType = 'login' | 'signup';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.3 64.5C308.6 102.3 282.7 90 248 90c-82.1 0-148.9 66.8-148.9 148.9s66.8 148.9 148.9 148.9c94.9 0 131.3-64.4 136-98.2H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
    </svg>
);

export function AuthForm({ type }: { type: AuthFormType }) {
  const title = type === 'login' ? 'Welcome Back' : 'Create an Account';
  const description =
    type === 'login'
      ? 'Sign in to access your notes.'
      : 'Start your journey with Smart Notes.';
  const buttonText = type === 'login' ? 'Login' : 'Sign Up';
  const footerText =
    type === 'login' ? (
      <>
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </>
    ) : (
      <>
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </>
    );

  return (
    <Card className="w-full max-w-sm glass shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
            <BrainCircuit className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button className="w-full">{buttonText}</Button>
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          <GoogleIcon />
          Google
        </Button>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {footerText}
        </div>
      </CardFooter>
    </Card>
  );
}
