
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
  Clock
} from "lucide-react";
import { aiListingAssistantSuggestion } from "@/ai/flows/ai-listing-assistant-suggestion-flow";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useUser, useFirestore, useStorage } from "@/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, doc, query, where, getDocs, limit, serverTimestamp } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function PostItemPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const storage = useStorage();
  
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
    if (!isUserLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please login to post an item.",
        variant: "destructive"
      });
      router.push("/");
    }
  }, [user, isUserLoading, router, toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 1) {
      toast({
        title: "Limit Reached",
        description: "Standardized schema supports 1 primary image.",
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = () => {
    setImages([]);
  };

  const getAiSuggestion = async () => {
    if (!formData.title || !formData.description || images.length === 0) {
      toast({
        title: "Missing Info",
        description: "Add a title, description and photo first!",
        variant: "destructive"
      });
      return;
    }

    setAiSuggesting(true);
    try {
      const result = await aiListingAssistantSuggestion({
        title: formData.title,
        description: formData.description,
        photoDataUris: images
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
    
    if (!user || !db) return;

    if (images.length === 0) {
      toast({
        title: "Photo Required",
        description: "Please add a photo of your item.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, "product_listings"),
        where("userId", "==", user.uid),
        where("createdAt", ">=", startOfDay),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.size >= 5) {
        toast({
          title: "Daily Limit Reached",
          description: "You can only post up to 5 items per day.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const listingId = doc(collection(db, "product_listings")).id;
      const imageRef = ref(storage, `listings/${listingId}/primary`);
      await uploadString(imageRef, images[0], 'data_url');
      const downloadUrl = await getDownloadURL(imageRef);

      const listingRef = doc(db, "product_listings", listingId);
      const listingData = {
        id: listingId,
        title: formData.title,
        price: parseFloat(formData.price),
        image: downloadUrl,
        category: formData.category,
        userId: user.uid,
        createdAt: serverTimestamp(),
        // Metadata
        description: formData.description,
        status: "approved", // auto-approving for standardized test flow
        userName: user.displayName || "Anonymous"
      };

      setDocumentNonBlocking(listingRef, listingData, { merge: true });

      toast({
        title: "Success!",
        description: "Your item is now live in the marketplace.",
      });
      
      router.push("/browsegillu");
    } catch (error) {
      console.error("Error posting listing:", error);
      toast({
        title: "Upload Failed",
        description: "Something went wrong.",
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
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-headline font-bold">Post an Item</h1>
        <p className="text-muted-foreground">Quickly list your item using the standardized schema.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Physics Textbook" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
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
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Books', 'Electronics', 'Furniture', 'Cycles', 'Lab Equipment', 'Hostel Essentials', 'Daily Use', 'Others'].map(c => (
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
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {images.length > 0 ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden group border-2">
                    <Image src={images[0]} alt="Preview" fill className="object-cover" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full shadow-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary transition-colors text-muted-foreground">
                    <Upload className="h-10 w-10" />
                    <span className="font-medium">Upload Primary Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Button size="lg" disabled={loading} className="w-full gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Listing
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary font-bold">
                <Sparkles className="h-5 w-5" />
                <span>AI Assistant</span>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2"
                onClick={getAiSuggestion}
                disabled={aiSuggesting}
              >
                {aiSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Suggest Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
