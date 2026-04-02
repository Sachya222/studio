
"use client";

import { 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  MessageSquare, 
  Handshake, 
  Recycle, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    title: "Verify Your Identity",
    description: "Sign up using your official .edu college email. We verify every user to ensure a safe, student-only environment.",
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    color: "bg-blue-50"
  },
  {
    title: "List or Browse",
    description: "Post items you no longer need in seconds using our AI assistant, or browse thousands of listings from peers on your campus.",
    icon: <Search className="h-8 w-8 text-accent" />,
    color: "bg-emerald-50"
  },
  {
    title: "Chat & Negotiate",
    description: "Use our secure in-app messaging to ask questions, request more photos, and agree on a fair price.",
    icon: <MessageSquare className="h-8 w-8 text-amber-500" />,
    color: "bg-amber-50"
  },
  {
    title: "Meet & Exchange",
    description: "Arrange a meetup at a safe campus location (like the library or student union) to inspect the item and complete the trade.",
    icon: <Handshake className="h-8 w-8 text-indigo-500" />,
    color: "bg-indigo-50"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-secondary/30 border-b">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-6">How CampusCycle Works</h1>
          <p className="text-xl text-muted-foreground">
            Building a sustainable campus marketplace starts with trust. Here is how we make buying and selling easy for every student.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-1/4 left-0 w-full h-0.5 bg-border -z-10" />
            
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-6">
                <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center shadow-sm border border-black/5 relative`}>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  {step.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-headline font-bold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Deep Dive */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
              <PlusCircle className="h-4 w-4" />
              <span>For Sellers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Recycle your items in minutes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {[
                "Take 3 quick photos of your item",
                "Let our AI suggest the best price and category",
                "Reach hundreds of students in your building instantly",
                "Keep 100% of your profit - no hidden fees"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-secondary/10 rounded-xl border border-border/50">
                  <ChevronRight className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/post" className="inline-block">
              <Button size="lg" className="gap-2">Post an Item <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Buyer Deep Dive */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm">
              <Search className="h-4 w-4" />
              <span>For Buyers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Find essentials at student prices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {[
                "Browse by category or search for specific textbooks",
                "Filter by your specific campus or college hall",
                "Compare prices from multiple student sellers",
                "Save items to your wishlist for later"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border/50 shadow-sm">
                  <ChevronRight className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/browsegillu" className="inline-block">
              <Button variant="outline" size="lg" className="gap-2 border-2">Start Browsing <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <ShieldCheck className="h-16 w-16 mx-auto opacity-20" />
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Safety is our Priority</h2>
            <p className="text-xl opacity-90">
              We know meeting strangers can be nerve-wracking. That's why CampusCycle is built exclusively for the university community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <h4 className="font-bold mb-2">Verified Emails</h4>
                <p className="text-sm opacity-80">Only .edu email holders can access the marketplace.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <h4 className="font-bold mb-2">Campus Meetups</h4>
                <p className="text-sm opacity-80">We suggest high-traffic campus spots for all exchanges.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <h4 className="font-bold mb-2">User Ratings</h4>
                <p className="text-sm opacity-80">Rate your experience after every trade to build trust.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-8">
            <Recycle className="h-12 w-12 text-accent mx-auto" />
            <h2 className="text-3xl font-headline font-bold">Ready to join the cycle?</h2>
            <p className="text-muted-foreground text-lg">
              Start trading today and help build a more sustainable campus.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/post">
                <Button size="lg" className="px-12">Sell Something</Button>
              </Link>
              <Link href="/browsegillu">
                <Button variant="outline" size="lg" className="px-12">Explore Items</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
