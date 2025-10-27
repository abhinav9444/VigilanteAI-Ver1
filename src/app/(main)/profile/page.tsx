'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reportHeader, setReportHeader] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');

        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setReportHeader(userData.reportHeader || '');
        }
        setIsFetchingData(false);
      } else if (!isUserLoading) {
        setIsFetchingData(false);
      }
    }
    fetchUserData();
  }, [user, isUserLoading, firestore]);


  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      if (auth.currentUser) {
        if (name !== user.displayName) {
          await updateProfile(auth.currentUser, { displayName: name });
        }
        if (email !== user.email) {
           // Updating email requires re-authentication, so we'll skip this for now
           // to avoid a complex flow and focus on the Firestore write error.
           // await updateEmail(auth.currentUser, email);
        }
      }

      // Update Firestore document
      const userRef = doc(firestore, 'users', user.uid);
      const nameParts = name.split(' ');
      const dataToSave = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: email,
        username: email,
        reportHeader: reportHeader,
      };

      setDocumentNonBlocking(
        userRef,
        dataToSave,
        { merge: true }
      );

      toast({
        title: 'Profile Update In Progress',
        description: 'Your changes are being saved.',
      });
    } catch (error: any) {
      console.error('Error initiating profile update:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          error.message || 'There was a problem starting the profile update.',
      });
    } finally {
      // Since the update is non-blocking, we can consider the "saving" state finished here.
      // The UI will update optimistically or via the real-time listener.
      setIsSaving(false);
    }
  };

  if (isUserLoading || isFetchingData) {
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
            <div className="grid gap-2">
                <Label htmlFor="reportHeader">Report Header</Label>
                <Skeleton className="h-10 w-full" />
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
            <div className="grid gap-2">
              <Label htmlFor="reportHeader">Report Header</Label>
              <Input
                id="reportHeader"
                placeholder="e.g., Cyber Security Researcher"
                value={reportHeader}
                onChange={(e) => setReportHeader(e.target.value)}
                disabled={isSaving}
              />
              <p className="text-sm text-muted-foreground">
                This will be displayed under your name on generated reports.
              </p>
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
