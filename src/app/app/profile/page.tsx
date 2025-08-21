'use client';

import { useAuth } from '@/lib/firebase/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'SN';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0) + names[1].charAt(0);
    }
    return name.charAt(0);
  }

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-3xl font-bold font-headline">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} data-ai-hint="user avatar" />
              <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Photo</Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" defaultValue={user.displayName ?? ''} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={user.email ?? ''} disabled />
          </div>

          <Button>Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
