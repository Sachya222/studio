
import Link from "next/link";
import { Recycle, Github, Twitter, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Recycle className="h-6 w-6 text-primary" />
              <span className="text-xl font-headline font-bold text-primary">CampusCycle</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The exclusive marketplace for college students. Buy, sell, and recycle within your verified campus community.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/browse" className="hover:text-primary">All Listings</Link></li>
              <li><Link href="/browse?category=Books" className="hover:text-primary">Books</Link></li>
              <li><Link href="/browse?category=Electronics" className="hover:text-primary">Electronics</Link></li>
              <li><Link href="/browse?category=Furniture" className="hover:text-primary">Furniture</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/how-it-works" className="hover:text-primary">How It Works</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-primary">About CampusCycle</Link></li>
              <li><Link href="/faq" className="hover:text-primary">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold mb-4">Get in Touch</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Join our mailing list to receive campus deals and sustainability tips.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="college@edu.com" 
                className="bg-background border rounded-md px-3 py-2 text-sm flex-1 outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2024 CampusCycle Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary underline-offset-4 hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary underline-offset-4 hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:text-primary underline-offset-4 hover:underline">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
