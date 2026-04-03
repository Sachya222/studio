"use client";

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, where, limit } from "firebase/firestore";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2, IndianRupee, PackageOpen } from "lucide-react";
import Image from "next/image";

/**
 * BrowsePage displays a real-time list of approved products from the marketplace.
 * It strictly follows the rules of listing within a 50-item limit for security and performance.
 */
export default function BrowsePage() {
  const db = useFirestore();

  const listingsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, "product_listings"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  }, [db]);

  const { data: listings, isLoading } = useCollection(listingsQuery);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12 space-y-2">
        <h1 className="text-4xl font-headline font-bold text-foreground tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground text-lg">Browse items from your SRMU Lucknow community.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Fetching latest listings...</p>
        </div>
      ) : !listings || listings.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-secondary/10 flex flex-col items-center gap-4">
          <div className="p-4 bg-background rounded-full shadow-sm">
            <PackageOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-xl text-muted-foreground font-medium">No products available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {listings.map((item) => (
            <Card key={item.id} className="group overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 border border-primary/10 bg-card">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image 
                  src={item.image || "https://picsum.photos/seed/placeholder/400/300"} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              <CardHeader className="p-5 pb-0">
                <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.category}</p>
              </CardHeader>
              <CardContent className="p-5 pt-3">
                <div className="text-2xl font-bold text-primary flex items-center">
                  <IndianRupee className="h-5 w-5 mr-0.5" />
                  {item.price}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}