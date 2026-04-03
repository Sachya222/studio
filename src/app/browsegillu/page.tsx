
"use client";

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit, where } from "firebase/firestore";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, IndianRupee, Search, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function BrowsePage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");

  const listingsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, "product_listings"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  }, [db]);

  const { data: listings, isLoading } = useCollection(listingsQuery);

  const filteredListings = listings?.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold">Browse Marketplace</h1>
          <p className="text-muted-foreground">Discover second-hand treasures from your fellow students.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search items or categories..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : !filteredListings || filteredListings.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-3xl">
          <p className="text-xl text-muted-foreground">No items found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredListings.map((item) => (
            <Card key={item.id} className="group overflow-hidden flex flex-col hover:shadow-xl transition-shadow border-2 border-primary/5">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image 
                  src={item.image || "https://picsum.photos/seed/placeholder/400/300"} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-3 right-3 bg-white/90 text-primary border-none shadow-sm">
                  {item.category}
                </Badge>
              </div>
              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold line-clamp-1">{item.title}</CardTitle>
                </div>
                <div className="text-2xl font-bold text-primary flex items-center mt-1">
                  <IndianRupee className="h-5 w-5" />{item.price}
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 flex-grow flex flex-col justify-end">
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-3 w-3" />
                  </div>
                  <span className="font-medium">{item.userName || "Student"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
