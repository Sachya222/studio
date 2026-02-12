
"use client";

import { useState } from "react";
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
  CheckCircle2, 
  AlertCircle,
  Recycle,
  Tag,
  DollarSign
} from "lucide-react";
import { aiListingAssistantSuggestion } from "@/ai/flows/ai-listing-assistant-suggestion-flow";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function PostItemPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    condition: "",
    college: ""
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Success!",
        description: "Your item is now live on CampusCycle.",
      });
      // Reset form...
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-headline font-bold">List an Item</h1>
        <p className="text-muted-foreground">Turn your unused items into cash and help other students.</p>
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
                  placeholder="e.g. Calculus Early Transcendentals 8th Ed" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the condition, any defects, or specific features..." 
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
            <Button variant="outline" type="button">Save Draft</Button>
            <Button size="lg" disabled={loading} className="gap-2 px-8">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Publish Listing
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
              <CardDescription>Get the perfect price and category automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your photos and description to suggest values that help your item sell faster.
              </p>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all"
                onClick={getAiSuggestion}
                disabled={aiSuggesting}
              >
                {aiSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Get AI Suggestions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Asking Price ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="price" 
                    placeholder="0.00" 
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
                  placeholder="e.g. Harvard University" 
                  value={formData.college}
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                  required
                />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Buyers will see this location.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-accent/10 rounded-xl border border-accent/20 space-y-3">
            <div className="flex items-center gap-2 text-accent font-bold">
              <Recycle className="h-5 w-5" />
              <span>Sustainability Tip</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Donating a percentage of your proceeds to campus green funds increases your sustainability rating!
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
