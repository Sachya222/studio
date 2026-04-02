"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Package, 
  Pencil, 
  Trash2, 
  ExternalLink,
  IndianRupee,
  Plus
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function MyListingsPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const myListingsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, "product_listings"),
      where("sellerId", "==", user.uid),
      orderBy("postedDate", "desc")
    );
  }, [db, user?.uid]);

  const { data: listings, isLoading } = useCollection(myListingsQuery);

  const handleDelete = (id: string) => {
    if (!db) return;
    if (confirm("Are you sure you want to delete this listing?")) {
      const docRef = doc(db, "product_listings", id);
      deleteDocumentNonBlocking(docRef);
      toast({
        title: "Listing Deleted",
        description: "Your item has been removed from the marketplace.",
      });
    }
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage the items you've posted for sale.</p>
        </div>
        <Link href="/post">
          <Button className="gap-2 rounded-full">
            <Plus className="h-4 w-4" /> Post New Item
          </Button>
        </Link>
      </div>

      {!listings || listings.length === 0 ? (
        <Card className="border-2 border-dashed py-20 text-center flex flex-col items-center justify-center space-y-6">
          <div className="bg-secondary p-6 rounded-full">
            <Package className="h-12 w-12 text-primary opacity-50" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-headline">No listings yet</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              You haven't posted any items for sale yet. Start clearing your dorm today!
            </p>
          </div>
          <Link href="/post">
            <Button variant="outline" className="rounded-full">Post Your First Item</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image 
                  src={listing.imageUrls?.[0] || "https://picsum.photos/seed/placeholder/400/300"} 
                  alt={listing.title} 
                  fill 
                  className="object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-white/90 text-black border-none shadow-sm">
                  {listing.status === "active" ? "Live" : "Sold"}
                </Badge>
              </div>
              <CardHeader className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary flex items-center">
                    <IndianRupee className="h-4 w-4" />{listing.price}
                  </span>
                  <Badge variant="outline" className="text-[10px] uppercase">{listing.category}</Badge>
                </div>
                <h3 className="font-bold text-lg line-clamp-1">{listing.title}</h3>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 text-sm text-muted-foreground flex-grow">
                <p className="line-clamp-2">{listing.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t flex gap-2">
                <Link href={`/edit/${listing.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1 gap-2"
                  onClick={() => handleDelete(listing.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
                <Link href={`/item/${listing.id}`}>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
