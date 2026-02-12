
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Recycle, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Star,
  Users,
  Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Books", icon: "📚", color: "bg-blue-100" },
  { name: "Electronics", icon: "💻", color: "bg-purple-100" },
  { name: "Furniture", icon: "🪑", color: "bg-amber-100" },
  { name: "Cycles", icon: "🚲", color: "bg-emerald-100" },
  { name: "Lab Equipment", icon: "🧪", color: "bg-rose-100" },
  { name: "Hostel Essentials", icon: "🛏", color: "bg-indigo-100" },
  { name: "Daily Use", icon: "🧴", color: "bg-orange-100" },
  { name: "Others", icon: "📦", color: "bg-slate-100" },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm border border-accent/20">
                <Globe className="h-4 w-4" />
                <span>Over 2,500kg CO2 saved this month</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground leading-tight">
                Buy. Sell. Recycle. <br />
                <span className="text-primary">Within Your Campus.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The trusted marketplace exclusive to students. Verify with your college email and start trading second-hand essentials with peers you can trust.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/browse">
                  <Button size="lg" className="h-14 px-8 text-lg gap-2">
                    Browse Items <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/post">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 hover:bg-secondary">
                    Start Selling
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                      <Image 
                        src={`https://picsum.photos/seed/user${i}/40/40`} 
                        alt="User" width={40} height={40} 
                        data-ai-hint="student face"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold">500+</span> Students active today
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative w-full max-w-xl">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-1 lg:rotate-3 transition-transform hover:rotate-0 duration-500">
                <Image 
                  src={heroImage?.imageUrl || ""} 
                  alt="Students on campus" 
                  width={600} 
                  height={400} 
                  className="object-cover"
                  priority
                  data-ai-hint="college students"
                />
              </div>
              
              {/* Floating feature card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border hidden md:block max-w-[200px] animate-bounce">
                <div className="flex items-center gap-2 text-accent font-bold mb-1">
                  <ShieldCheck className="h-5 w-5" /> Verified
                </div>
                <p className="text-xs text-muted-foreground">Only students with .edu emails can join.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold">Explore Categories</h2>
              <p className="text-muted-foreground">Find exactly what you need for your hostel or course.</p>
            </div>
            <Link href="/browse" className="text-primary font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/browse?category=${cat.name}`}>
                <Card className="hover:border-primary transition-all hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                    <span className={cn("text-3xl p-3 rounded-xl transition-colors", cat.color)}>{cat.icon}</span>
                    <span className="text-sm font-semibold group-hover:text-primary">{cat.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why CampusCycle */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">The Smarter Way to Campus Life</h2>
          <p className="text-muted-foreground">CampusCycle is built by students, for students. We focus on what matters to your university experience.</p>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Student Verified",
                desc: "No more random strangers. Every user is verified with their college email address for 100% campus security.",
                icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                bg: "bg-blue-50"
              },
              {
                title: "In-App Chat",
                desc: "Real-time communication with sellers. Negotiate, ask for more photos, and fix meetup spots safely.",
                icon: <Zap className="h-8 w-8 text-amber-500" />,
                bg: "bg-amber-50"
              },
              {
                title: "Sustainable Living",
                desc: "Reduce waste and promote a circular economy. Every item sold is one less piece of plastic in the landfill.",
                icon: <Recycle className="h-8 w-8 text-accent" />,
                bg: "bg-emerald-50"
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border hover:shadow-lg transition-shadow bg-card text-left space-y-4">
                <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center", feature.bg)}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-headline font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Impact Counter */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white font-medium text-sm backdrop-blur-sm">
                <Recycle className="h-4 w-4" />
                <span>Our Eco Impact</span>
              </div>
              <h2 className="text-4xl font-headline font-bold">Making a Greener Campus Together</h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                By choosing to buy second-hand, our community has diverted thousands of items from landfills. Join us in building a more sustainable future for your university.
              </p>
              <Link href="/about">
                <Button variant="secondary" className="gap-2">Learn about our mission <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {[
                { label: "Items Reused", val: "12.4k+", icon: <Recycle /> },
                { label: "CO2 Saved (kg)", val: "45k+", icon: <Globe /> },
                { label: "Money Saved", val: "$150k+", icon: <Zap /> },
                { label: "Active Campuses", val: "45+", icon: <Users /> }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-2">
                  <div className="text-3xl font-bold font-headline">{stat.val}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-secondary/50 rounded-3xl p-12 md:p-20 border-2 border-dashed border-primary/20 space-y-8">
            <h2 className="text-3xl md:text-5xl font-headline font-bold">Ready to Declutter Your Dorm?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students saving money and the planet. Listing takes less than 2 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/post">
                <Button size="lg" className="h-16 px-10 text-xl font-bold shadow-xl shadow-primary/20">
                  Post Your First Item
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Secure, verified and student-only.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
