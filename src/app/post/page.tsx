
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
  AlertCircle,
  Recycle,
  IndianRupee,
  Clock
} from "lucide-react";
import { aiListingAssistantSuggestion } from "@/ai/flows/ai-listing-assistant-suggestion-flow";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useUser, useFirestore, useStorage } from "@/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, doc, query, where, getDocs } from "firebase/firestore";
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

    if (images.length + files.length > 3) {
      toast({
        title: "Limit Reached",
        description: "You can only upload up to 3 images.",
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const getAiSuggestion = async () => {
    if (!formData.title || !formData.description || images.length === 0) {
      toast({
        title: "Missing Info",
        description: "Add a title, description and at least one photo first!",
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
        title: "Photos Required",
        description: "Please add at least one photo of your item.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Check daily upload limit (max 5 per day)
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const startOfDayISO = startOfDay.toISOString();

      const q = query(
        collection(db, "product_listings"),
        where("sellerId", "==", user.uid),
        where("postedDate", ">=", startOfDayISO)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.size >= 5) {
        toast({
          title: "Daily Limit Reached",
          description: "To ensure quality, you can only post up to 5 items per day.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const imageUrls: string[] = [];
      const listingId = doc(collection(db, "product_listings")).id;

      for (let i = 0; i < images.length; i++) {
        const imageRef = ref(storage, `listings/${listingId}/image_${i}`);
        await uploadString(imageRef, images[i], 'data_url');
        const downloadUrl = await getDownloadURL(imageRef);
        imageUrls.push(downloadUrl);
      }

      const listingRef = doc(db, "product_listings", listingId);
      const listingData = {
        id: listingId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        condition: formData.condition,
        collegeLocation: formData.college,
        imageUrls: imageUrls,
        sellerId: user.uid,
        postedDate: new Date().toISOString(),
        status: "pending", // New items start as pending
        userName: user.displayName,
        userEmail: user.email
      };

      setDocumentNonBlocking(listingRef, listingData, { merge: true });

      toast({
        title: "Submission Successful!",
        description: "Your item has been submitted and is pending approval by an admin.",
      });
      
      router.push("/my-listings");
    } catch (error) {
      console.error("Error posting listing:", error);
      toast({
        title: "Upload Failed",
        description: "Something went wrong while publishing your listing.",
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
        <h1 className="text-3xl font-headline font-bold">List an Item</h1>
        <p className="text-muted-foreground">Turn your unused items into cash. Note: All listings require admin approval.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Details</CardTitle>
              <CardDescription>What are you selling today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Engineering Mathematics - I" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the condition..." 
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
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Cycles">Cycles</SelectItem>
                      <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                      <SelectItem value="Hostel Essentials">Hostel Essentials</SelectItem>
                      <SelectItem value="Daily Use Items">Daily Use Items</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
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
                      <SelectItem value="New">Brand New</SelectItem>
                      <SelectItem value="Like New">Like New</SelectItem>
                      <SelectItem value="Good">Good / Used</SelectItem>
                      <SelectItem value="Fair">Fair / Well Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Asking Price (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="price" 
                    type="number"
                    className="pl-9" 
                    placeholder="500"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Upload up to 3 clear photos of your item.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border-2">
                    <Image src={img} alt="Preview" fill className="object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary transition-colors text-muted-foreground hover:text-primary">
                    <Upload className="h-6 w-6" />
                    <span className="text-xs font-medium">Add Photo</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button size="lg" disabled={loading} className="gap-2 px-8">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit for Approval
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Sparkles className="h-5 w-5" />
                <span>AI Listing Assistant</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2 border-primary/20 hover:bg-primary/10"
                onClick={getAiSuggestion}
                disabled={aiSuggesting}
              >
                {aiSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Get AI Suggestions
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <Clock className="h-5 w-5" />
              <span>Limits & Process</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-amber-700 leading-relaxed font-semibold">
                • Max 5 uploads per day per student.
              </p>
              <p className="text-xs text-amber-600 leading-relaxed">
                • Every item is reviewed for safety.
              </p>
              <p className="text-xs text-amber-600 leading-relaxed">
                • Approvals usually take less than 24h.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
