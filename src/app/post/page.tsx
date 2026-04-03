
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
  IndianRupee,
  AlertTriangle
} from "lucide-react";
import { aiListingAssistantSuggestion } from "@/ai/flows/ai-listing-assistant-suggestion-flow";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useUser, useFirestore, useStorage, addDocumentNonBlocking } from "@/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, serverTimestamp, query, where, getDocs, Timestamp } from "firebase/firestore";

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

const DAILY_UPLOAD_LIMIT = 5;

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

  const checkDailyLimit = async (userId: string) => {
    if (!db) return false;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, "product_listings"),
      where("userId", "==", userId),
      where("createdAt", ">=", Timestamp.fromDate(startOfToday))
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size < DAILY_UPLOAD_LIMIT;
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
      // 0. Check daily limit
      const canUpload = await checkDailyLimit(user.uid);
      if (!canUpload) {
        toast({
          title: "Limit Reached",
          description: `You can only upload ${DAILY_UPLOAD_LIMIT} items per day.`,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // 1. Upload image to storage
      const tempId = Math.random().toString(36).substring(7);
      const imageRef = ref(storage, `listings/${user.uid}/${tempId}`);
      await uploadString(imageRef, imagePreview, 'data_url');
      
      // 2. Get download URL
      const imageUrl = await getDownloadURL(imageRef);

      // 3. Save in firestore using required schema
      const listingData = {
        title: formData.title,
        price: parseFloat(formData.price),
        image: imageUrl,
        category: formData.category,
        userId: user.uid,
        createdAt: serverTimestamp(),
        description: formData.description,
        status: "pending" 
      };

      addDocumentNonBlocking(collection(db, "product_listings"), listingData);

      toast({
        title: "Listing Submitted",
        description: "Your item has been sent for approval.",
      });
      
      router.push("/browsegillu");
    } catch (error) {
      console.error("Error posting listing:", error);
      toast({
        title: "Post Failed",
        description: "There was an error saving your listing.",
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
        <p className="text-muted-foreground">Reach students at SRMU Lucknow instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-primary/5">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Engineering Mathematics Textbook" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Condition, year, usage details..."
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
              <CardTitle>Photo</CardTitle>
              <CardDescription>Upload a clear image of your item.</CardDescription>
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
            Post for Approval
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
                Let AI analyze your photo and description to suggest the best price for the SRMU Lucknow campus.
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

          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4 flex gap-3 text-amber-800">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div className="text-xs space-y-1">
                <p className="font-bold">Community Rules</p>
                <p>Maximum 5 uploads per day allowed per student.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
