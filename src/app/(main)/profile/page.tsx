'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        if (email !== user.email) {
          await updateEmail(auth.currentUser, email);
        }
      }

      // Update Firestore document
      const userRef = doc(firestore, 'users', user.uid);
      const nameParts = name.split(' ');
      await setDoc(
        userRef,
        {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: email,
          username: email,
        },
        { merge: true }
      );

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          error.message || 'There was a problem saving your profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information.
          </p>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              This information will be displayed publicly so be careful what you
              share.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="grid gap-1.5 w-full">
                <Label htmlFor="picture">Picture</Label>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
             <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  const userInitials =
    name
      .split(' ')
      .map((n) => n[0])
      .join('') || '?';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information.
        </p>
      </div>
      <Separator />
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              This information will be displayed publicly so be careful what you
              share.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || ''} alt={`@${name}`} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1.5 w-full">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" disabled />
                <p className="text-sm text-muted-foreground">
                  Profile picture updates are coming soon.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
