
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Clock, 
  Heart,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const mockListings = [
  {
    id: "1",
    title: "Essential Organic Chemistry (2nd Ed)",
    price: 35,
    category: "Books",
    condition: "Like New",
    college: "State University",
    postedAt: "2h ago",
    image: "https://picsum.photos/seed/book1/400/300"
  },
  {
    id: "2",
    title: "Logitech MX Master 3 Mouse",
    price: 60,
    category: "Electronics",
    condition: "Used",
    college: "Tech Institute",
    postedAt: "5h ago",
    image: "https://picsum.photos/seed/mouse1/400/300"
  },
  {
    id: "3",
    title: "Standard Dorm Desk Lamp",
    price: 15,
    category: "Furniture",
    condition: "Good",
    college: "State University",
    postedAt: "1d ago",
    image: "https://picsum.photos/seed/lamp1/400/300"
  },
  {
    id: "4",
    title: "Raleigh City Cruiser Bike",
    price: 120,
    category: "Cycles",
    condition: "Used",
    college: "Downtown College",
    postedAt: "3h ago",
    image: "https://picsum.photos/seed/bike1/400/300"
  },
  {
    id: "5",
    title: "TI-84 Plus Graphic Calculator",
    price: 45,
    category: "Electronics",
    condition: "Like New",
    college: "State University",
    postedAt: "6h ago",
    image: "https://picsum.photos/seed/calc1/400/300"
  },
  {
    id: "6",
    title: "Dorm Storage Cubes (Set of 4)",
    price: 20,
    category: "Hostel Essentials",
    condition: "New",
    college: "West Campus",
    postedAt: "12h ago",
    image: "https://picsum.photos/seed/box1/400/300"
  }
];

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Books", "Electronics", "Furniture", "Cycles", "Lab Equipment", "Hostel Essentials"];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="w-full md:max-w-md relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            className="pl-10 h-12 text-lg rounded-full" 
            placeholder="Search textbooks, electronics..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          <Button variant="outline" className="gap-2 rounded-full whitespace-nowrap">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" className="gap-2 rounded-full whitespace-nowrap">
            University <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2 rounded-full whitespace-nowrap">
            Price <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Badge 
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            className="px-6 py-2 text-sm cursor-pointer rounded-full transition-all"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockListings.map((listing) => (
          <Card key={listing.id} className="group overflow-hidden hover:shadow-xl transition-all border-none bg-white shadow-sm ring-1 ring-border/50">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image 
                src={listing.image} 
                alt={listing.title} 
                fill 
                className="object-cover transition-transform group-hover:scale-105 duration-500"
                data-ai-hint="product listing"
              />
              <Badge className="absolute top-3 left-3 bg-white/90 text-black hover:bg-white backdrop-blur-sm border-none shadow-sm font-semibold">
                {listing.category}
              </Badge>
              <button className="absolute top-3 right-3 h-9 w-9 bg-white/90 text-primary hover:text-red-500 backdrop-blur-sm flex items-center justify-center rounded-full shadow-sm transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            <CardHeader className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">${listing.price}</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {listing.condition}
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {listing.title}
              </h3>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{listing.college}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Posted {listing.postedAt}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t flex gap-2 mt-auto">
              <Button size="sm" className="flex-1 gap-2">
                <MessageSquare className="h-4 w-4" /> Chat
              </Button>
              <Link href={`/item/${listing.id}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full">
                  Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center space-y-4">
        <p className="text-muted-foreground">Can't find what you're looking for?</p>
        <Button variant="secondary" size="lg" className="rounded-full">
          Request an Item
        </Button>
      </div>
    </div>
  );
}
