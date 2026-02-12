
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Heart, 
  User, 
  Menu, 
  X,
  Recycle
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:rotate-12">
              <Recycle className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-headline font-bold text-primary tracking-tight">
              CampusCycle
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-sm font-medium hover:text-primary transition-colors">
              Browse
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How it works
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Sustainability
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/post">
            <Button variant="default" className="gap-2 bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4" />
              Start Selling
            </Button>
          </Link>
          <div className="flex items-center border-l pl-4 gap-2">
            <Link href="/chat">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <button 
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden absolute w-full bg-background border-b transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-96 py-4" : "max-h-0"
      )}>
        <div className="flex flex-col gap-4 px-4">
          <Link href="/browse" className="text-lg font-medium">Browse Listings</Link>
          <Link href="/how-it-works" className="text-lg font-medium">How it works</Link>
          <Link href="/about" className="text-lg font-medium">Sustainability</Link>
          <Link href="/post" className="w-full">
            <Button className="w-full gap-2">
              <PlusCircle className="h-4 w-4" />
              Start Selling
            </Button>
          </Link>
          <div className="flex justify-around pt-2 border-t">
            <Link href="/chat" className="p-2"><MessageSquare className="h-6 w-6" /></Link>
            <Link href="/wishlist" className="p-2"><Heart className="h-6 w-6" /></Link>
            <Link href="/profile" className="p-2"><User className="h-6 w-6" /></Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
