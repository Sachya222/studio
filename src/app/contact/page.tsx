
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MessageSquare, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Sent",
        description: "We'll get back to you within 24 hours.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Get in Touch</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions about verifying your college email? Or want to bring CampusCycle to your university? We're here to help.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Support Email</h3>
                <p className="text-muted-foreground">hello@campuscycle.edu</p>
                <p className="text-sm text-primary mt-1">Average response: 2h</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Ambassador Program</h3>
                <p className="text-muted-foreground">join@campuscycle.edu</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Headquarters</h3>
                <p className="text-muted-foreground">Innovation Hub, Campus Way, Boston, MA 02118</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card className="shadow-2xl border-none">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl">Send a Message</CardTitle>
              <CardDescription>Fill out the form below and our team will be in touch.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">College Email</Label>
                    <Input id="email" type="email" placeholder="john@university.edu" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this regarding?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you today?" className="min-h-[150px]" required />
                </div>
                <Button type="submit" size="lg" className="w-full gap-2 text-lg" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
