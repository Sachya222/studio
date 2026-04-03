
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  IndianRupee
} from "lucide-react";
import { aiListingAssistantSuggestion } from "@/ai/flows/ai-listing-assistant-suggestion-flow";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useUser, useFirestore, useStorage } from "@/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const CATEGORIES = [
  'Books', 
  'Electronics', 
  'Furniture', 
  'Cycles', 
  'Lab Equipment', 
  'Hostel Essentials', 
  'Daily Use', 
  'Others'
];

export default function PostItemPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const storage = useStorage();
  
  const [loading, setLoading] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please login to post an item.",
        variant: "destructive"
      });
      router.push("/");
    }
  }, [user, isUserLoading, router, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getAiSuggestion = async () => {
    if (!formData.title || !formData.description || !imagePreview) {
      toast({
        title: "Incomplete Details",
        description: "Please provide a title, description, and photo for the AI to analyze.",
        variant: "destructive"
      });
      return;
    }

    setAiSuggesting(true);
    try {
      const result = await aiListingAssistantSuggestion({
        title: formData.title,
        description: formData.description,
        photoDataUris: [imagePreview]
      });

      setFormData(prev => ({
        ...prev,
        category: result.suggestedCategory,
        price: result.suggestedPrice.toString()
      }));

      toast({
        title: "AI Suggestion Applied",
        description: result.reasoning,
      });
    } catch (error) {
      toast({
        title: "AI Assistant Unavailable",
        description: "We couldn't get a suggestion at this time.",
        variant: "destructive"
      });
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !db || !storage) return;

    if (!imagePreview) {
      toast({
        title: "Photo Missing",
        description: "Please upload an image of your item.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const listingId = doc(collection(db, "product_listings")).id;
      
      // 1. Upload to Storage
      const imageRef = ref(storage, `listings/${listingId}/primary`);
      await uploadString(imageRef, imagePreview, 'data_url');
      const downloadUrl = await getDownloadURL(imageRef);

      // 2. Save to Firestore with EXACT requested fields
      const listingRef = doc(db, "product_listings", listingId);
      const listingData = {
        title: formData.title,
        price: parseFloat(formData.price),
        image: downloadUrl,
        category: formData.category,
        userId: user.uid,
        createdAt: serverTimestamp(),
        // Keeping description for UX but title/price/image/category/userId/createdAt are primary
        description: formData.description,
        userName: user.displayName || "Anonymous Student",
        userEmail: user.email || "",
        status: "approved" 
      };

      setDocumentNonBlocking(listingRef, listingData, { merge: true });

      toast({
        title: "Listing Published!",
        description: "Your item is now visible to other students.",
      });
      
      router.push("/browsegillu");
    } catch (error) {
      console.error("Error posting listing:", error);
      toast({
        title: "Post Failed",
        description: "There was an error saving your listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-headline font-bold">List Your Item</h1>
        <p className="text-muted-foreground">Fill in the details below to reach students at SRMU Lucknow.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-primary/5">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Item Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Engineering Graphics Kit" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell students about the condition, usage, and why you're selling it."
                  className="min-h-[120px]"
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
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="price" 
                      type="number"
                      className="pl-9" 
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/5">
            <CardHeader>
              <CardTitle>Item Photo</CardTitle>
              <CardDescription>A clear photo helps sell your item faster.</CardDescription>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <Button 
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 rounded-full shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="aspect-video rounded-xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 transition-all text-muted-foreground group">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-foreground block">Click to upload photo</span>
                    <span className="text-sm">JPG, PNG or WEBP (Max 5MB)</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </CardContent>
          </Card>

          <Button size="lg" disabled={loading} className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/10">
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Post Your Item
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Sparkles className="h-5 w-5" />
                <span>AI Price Assistant</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Not sure what price to set? Let our AI suggest an optimal price and category based on your photos and description.
              </p>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2 border-primary/20 hover:bg-primary/10"
                onClick={getAiSuggestion}
                disabled={aiSuggesting || loading}
              >
                {aiSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Get AI Suggestion
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/30">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-bold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Posting Tips
              </h4>
              <ul className="text-sm space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <div className="text-primary font-bold">•</div>
                  Use natural lighting for better photos.
                </li>
                <li className="flex gap-2">
                  <div className="text-primary font-bold">•</div>
                  Be honest about any wear and tear.
                </li>
                <li className="flex gap-2">
                  <div className="text-primary font-bold">•</div>
                  Negotiate via in-app chat only.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
