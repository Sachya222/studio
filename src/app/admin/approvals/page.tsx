
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, doc, limit } from "firebase/firestore";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Inbox,
  ShieldAlert
} from "lucide-react";
import Image from "next/image";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";

export default function AdminApprovalsPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  // Fetch admin role doc only if logged in
  const adminDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "roles_admin", user.uid);
  }, [db, user?.uid]);

  const { data: adminData, isLoading: isAdminLoading } = useDoc(adminDocRef);

  useEffect(() => {
    if (!isUserLoading && !isAdminLoading) {
      if (!user || !adminData) {
        toast({
          title: "Access Denied",
          description: "Admin privileges required.",
          variant: "destructive"
        });
        router.push("/");
      }
    }
  }, [user, isUserLoading, adminData, isAdminLoading, router, toast]);

  // Only create the query if the user is confirmed as admin
  const pendingListingsQuery = useMemoFirebase(() => {
    if (!db || !adminData) return null;
    return query(
      collection(db, "product_listings"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  }, [db, adminData]);

  const { data: pendingListings, isLoading: isListingsLoading } = useCollection(pendingListingsQuery);

  const handleAction = (id: string, newStatus: "approved" | "deleted") => {
    if (!db) return;
    const docRef = doc(db, "product_listings", id);
    updateDocumentNonBlocking(docRef, { status: newStatus });
    
    toast({
      title: newStatus === "approved" ? "Item Approved" : "Item Rejected",
      description: `The item status has been updated.`,
    });
  };

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !adminData) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <ShieldAlert className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">Admin Approvals</h1>
          <p className="text-muted-foreground">Review and manage pending marketplace submissions.</p>
        </div>
      </div>

      {isListingsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !pendingListings || pendingListings.length === 0 ? (
        <Card className="border-2 border-dashed py-20 text-center flex flex-col items-center justify-center space-y-4">
          <Inbox className="h-12 w-12 text-muted-foreground opacity-30" />
          <h3 className="text-xl font-bold font-headline">All Caught Up!</h3>
          <p className="text-muted-foreground">No pending items requiring review.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden flex flex-col shadow-lg border-2 border-primary/10">
              <div className="relative aspect-video">
                <Image 
                  src={listing.image || "https://picsum.photos/seed/placeholder/400/300"} 
                  alt={listing.title} 
                  fill 
                  className="object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-amber-500 text-white">Pending</Badge>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>₹{listing.price}</span>
                  <span>•</span>
                  <span>{listing.category}</span>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 flex-grow">
                <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{listing.description}</p>
                <div className="text-[10px] font-medium p-2 bg-secondary/50 rounded-lg">
                  Submitted by: {listing.userName || "Unknown"}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t flex gap-2">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2" 
                  size="sm"
                  onClick={() => handleAction(listing.id, "approved")}
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 gap-2" 
                  size="sm"
                  onClick={() => handleAction(listing.id, "deleted")}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
