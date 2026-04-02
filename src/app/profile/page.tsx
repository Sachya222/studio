"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Star, 
  ShieldCheck,
  Loader2,
  Settings
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  // Fetch extended profile data from Firestore
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card className="text-center overflow-hidden border-none shadow-xl bg-white">
            <div className="h-24 bg-primary" />
            <CardContent className="relative pt-0 -mt-12">
              <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                <AvatarFallback className="bg-secondary text-primary text-2xl font-bold">
                  {user.displayName?.charAt(0) || <User className="w-12 h-12" />}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 space-y-1">
                <h2 className="text-xl font-headline font-bold">{user.displayName}</h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" /> {user.email}
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t flex justify-around">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {profile?.averageRating?.toFixed(1) || "0.0"}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">0</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sales</div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" size="sm" className="w-full gap-2 rounded-full">
                  <Settings className="h-4 w-4" /> Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-accent font-bold">
                <ShieldCheck className="h-5 w-5" />
                <span>Verification Status</span>
              </div>
              {profile?.isVerified ? (
                <Badge className="bg-accent hover:bg-accent text-white">Verified Student</Badge>
              ) : (
                <div className="space-y-3">
                  <Badge variant="outline" className="border-amber-500 text-amber-600">Verification Pending</Badge>
                  <p className="text-xs text-muted-foreground">
                    Please check your student email to verify your account and start selling.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline font-bold">Campus Information</CardTitle>
              <CardDescription>Details shared with potential buyers/sellers</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> College/University
                </div>
                <div className="font-medium">{profile?.collegeName || "SRMU Lucknow"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Joined CampusCycle
                </div>
                <div className="font-medium">
                  {profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : "Recently"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Course & Year
                </div>
                <div className="font-medium">{profile?.courseYear || "Not Specified"}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline font-bold">Active Listings</CardTitle>
                <CardDescription>Items you are currently selling</CardDescription>
              </div>
              <Button size="sm" className="rounded-full">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed rounded-xl">
                <div className="bg-secondary p-4 rounded-full">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold">No active listings yet</h4>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Clear out your dorm and help another student!
                  </p>
                </div>
                <Button variant="outline" size="sm">Create Listing</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
