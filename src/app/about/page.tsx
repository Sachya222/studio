
import { Recycle, Leaf, Globe, Zap, Users, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Mission Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Recycle className="h-16 w-16 mx-auto mb-8 opacity-20" />
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6">Our Mission</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            CampusCycle exists to empower students to build a more sustainable and affordable campus ecosystem through peer-to-peer sharing and verified local commerce.
          </p>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm">
                <Leaf className="h-4 w-4" />
                <span>Eco-Commitment</span>
              </div>
              <h2 className="text-4xl font-headline font-bold">Why Sustainability Matters to Us</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The average college student generates over 600 pounds of waste annually, much of it during move-out week. We believe that "waste" is just an item without a local home.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-secondary/30 rounded-2xl space-y-3">
                  <Zap className="h-8 w-8 text-primary" />
                  <h3 className="font-bold">Affordable Living</h3>
                  <p className="text-sm text-muted-foreground">Reduce student debt by buying used textbooks and essentials at 70% off retail.</p>
                </div>
                <div className="p-6 bg-secondary/30 rounded-2xl space-y-3">
                  <Globe className="h-8 w-8 text-accent" />
                  <h3 className="font-bold">Lower Footprint</h3>
                  <p className="text-sm text-muted-foreground">Eliminate shipping emissions by trading locally within your own campus halls.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://picsum.photos/seed/green1/800/600" 
                  alt="Sustainable Campus" 
                  width={800} 
                  height={600} 
                  className="object-cover"
                  data-ai-hint="eco campus"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl border max-w-xs">
                <div className="text-3xl font-bold text-primary mb-1">45,000kg</div>
                <div className="text-sm text-muted-foreground">Estimated CO2 saved by our users in the last year.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-headline font-bold">The CampusCycle Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground text-left">
              <p>
                It all started in a dorm room in 2023. Our founders, Alex and Jamie, were shocked by the amount of perfectly good furniture and textbooks thrown into campus dumpsters at the end of every semester.
              </p>
              <p>
                Alex needed a mini-fridge, and Jamie was throwing one away. They were in the same building, but had no way of knowing. That's when the idea for CampusCycle was born.
              </p>
              <p>
                Today, CampusCycle serves over 40 universities, helping students save money while fostering a culture of reuse that protects our planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-center mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Trust First",
                desc: "We prioritize safety by ensuring every user is a verified student within their respective community.",
                icon: <ShieldCheck className="h-10 w-10 text-primary" />
              },
              {
                title: "Inclusivity",
                desc: "Campus life should be affordable for everyone, regardless of their background or budget.",
                icon: <Users className="h-10 w-10 text-primary" />
              },
              {
                title: "Planet Friendly",
                desc: "We operate with a 'Green First' mindset, measuring our success by the amount of waste we prevent.",
                icon: <Heart className="h-10 w-10 text-accent" />
              }
            ].map((v, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold font-headline">{v.title}</h3>
                <p className="text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
