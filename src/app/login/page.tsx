
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn, Loader2, Recycle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/browsegillu');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        router.push('/browsegillu');
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Failed to sign in with Google.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <Card className="max-w-md w-full shadow-2xl border-none overflow-hidden">
        <div className="bg-primary p-12 text-center text-primary-foreground space-y-6">
          <div className="mx-auto w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center rotate-12">
            <Recycle className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold">CampusCycle</h1>
            <p className="opacity-80">SRMU Lucknow Student Marketplace</p>
          </div>
        </div>
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl">Log In</CardTitle>
          <CardDescription>Join your peers in sustainable trading.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-6">
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full h-14 text-lg font-bold gap-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Sign in with Google
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Secure student-only verification active</span>
          </div>

          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            By logging in, you agree to our terms and conditions.
            Only verified SRMU Lucknow emails are permitted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
