'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  User, 
  LogIn, 
  LogOut, 
  Settings, 
  ShoppingBag,
  UserCircle
} from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { AuthModal } from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function FloatingAuthButton() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out.",
      });
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              className="w-16 h-16 rounded-full shadow-2xl bg-accent hover:bg-accent/90 border-4 border-white transition-transform hover:scale-110 active:scale-95"
            >
              <Avatar className="w-full h-full">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback className="bg-accent text-white font-bold">
                  {user.displayName?.charAt(0) || <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{user.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer gap-2">
                <UserCircle className="w-4 h-4" /> Profile
              </DropdownMenuItem>
            </Link>
            <Link href="/my-listings">
              <DropdownMenuItem className="cursor-pointer gap-2">
                <ShoppingBag className="w-4 h-4" /> My Listings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer gap-2 text-destructive focus:text-destructive" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="icon" 
          disabled={isUserLoading}
          className="w-16 h-16 rounded-full shadow-2xl bg-accent hover:bg-accent/90 border-4 border-white transition-transform hover:scale-110 active:scale-95 group"
        >
          <LogIn className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
        </Button>
      )}

      <AuthModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
