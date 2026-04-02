"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Upload, 
  X, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  IndianRupee,
  Save,
  ArrowLeft
} from "lucide-react";
import { aiListingAssistantSuggestion } from "@/ai/flows/ai-listing-assistant-suggestion-flow";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function EditListingPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  
  const listingRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, "product_listings", id as string);
  }, [db, id]);

  const { data: listing, isLoading: isListingLoading } = useDoc(listingRef);

  const [loading, setLoading] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    condition: "",
    college: "SRMU Lucknow"
  });

  useEffect(() => {
    if (listing) {
      if (listing.sellerId !== user?.uid) {
        toast({
          title: "Access Denied",
          description: "You can only edit your own listings.",
          variant: "destructive"
        });
        router.push("/my-listings");
        return;
      }
      setFormData({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        price: listing.price.toString(),
        condition: listing.condition,
        college: listing.collegeLocation
      });
      setImages(listing.imageUrls || []);
    }
  }, [listing, user, router, toast]);

  const getAiSuggestion = async () => {
    if (!formData.title || !formData.description || images.length === 0) {
      toast({
        title: "Missing Info",
        description: "Title, description and at least one photo required for AI suggestion.",
        variant: "destructive"
      });
      return;
    }

    setAiSuggesting(true);
    try {
      const result = await aiListingAssistantSuggestion({
        title: formData.title,
        description: formData.description,
        photoDataUris: images.filter(img => img.startsWith('data:')) // AI only takes data uris
      });

      setFormData(prev => ({
        ...prev,
        category: result.suggestedCategory,
        price: result.suggestedPrice.toString()
      }));

      toast({
        title: "AI Suggestion Applied!",
        description: `Reason: ${result.reasoning}`,
      });
    } catch (error) {
      toast({
        title: "AI Failed",
        description: "Could not get a suggestion right now.",
        variant: "destructive"
      });
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !listingRef) return;

    setLoading(true);
    try {
      const updatedData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        condition: formData.condition,
        collegeLocation: formData.college,
        updatedDate: new Date().toISOString()
      };

      updateDocumentNonBlocking(listingRef, updatedData);

      toast({
        title: "Listing Updated",
        description: "Your changes have been saved successfully.",
      });
      
      router.push("/my-listings");
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Something went wrong while saving your changes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading || isListingLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !listing) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold">Edit Listing</h1>
          <p className="text-muted-foreground">Modify your item details for {listing.title}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Books', 'Electronics', 'Furniture', 'Cycles', 'Lab Equipment', 'Hostel Essentials', 'Daily Use Items', 'Others'].map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(val) => setFormData({...formData, condition: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {['New', 'Like New', 'Good', 'Fair'].map(cond => (
                        <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Note: Photo editing is restricted in this version.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2">
                    <Image src={img} alt="Preview" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button size="lg" disabled={loading} className="gap-2 px-8">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Sparkles className="h-5 w-5" />
                <span>AI Listing Assistant</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Recalculate the optimal price based on updated description.
              </p>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2 border-primary/20 hover:bg-primary/10"
                onClick={getAiSuggestion}
                disabled={aiSuggesting}
              >
                {aiSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Refresh AI Price
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Asking Price (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="price" 
                    className="pl-9" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">Pickup Campus</Label>
                <Input 
                  id="college" 
                  value={formData.college}
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
