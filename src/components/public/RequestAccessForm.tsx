
"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Send, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestAccessFormProps {
  onBack: () => void;
}

export function RequestAccessForm({ onBack }: RequestAccessFormProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // User picks a password for later account creation
    company: "",
    phone: "",
    surveyRequested: "",
    purpose: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      toast({ title: "System Readying", description: "Database is initializing, please try again." });
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(db, "viewer_requests"), {
        ...formData,
        status: "PENDING",
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl text-center p-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Request Received</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">Our team will review your application. You will be notified via email once your viewer account is approved.</p>
          <Button onClick={onBack} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]">
            Return to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center relative">
          <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-6 top-10 rounded-full hover:bg-slate-50">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold tracking-tight">Request Viewer Access</CardTitle>
            <CardDescription className="text-slate-500">Apply for a portal account to view analytics</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                <Input required placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-11 rounded-xl bg-slate-50/50 border-slate-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Work Email</Label>
                <Input type="email" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-11 rounded-xl bg-slate-50/50 border-slate-100" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Set Portal Password</Label>
              <Input type="password" required minLength={6} placeholder="Min 6 characters" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="h-11 rounded-xl bg-slate-50/50 border-slate-100" />
              <p className="text-[10px] text-slate-400 italic px-1">Choose a password to use once your account is activated.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Company</Label>
                <Input required placeholder="Organization Name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="h-11 rounded-xl bg-slate-50/50 border-slate-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone</Label>
                <Input required placeholder="+91..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-11 rounded-xl bg-slate-50/50 border-slate-100" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Ward/Survey Interest</Label>
              <Input required placeholder="e.g. Ward 80 Indiranagar" value={formData.surveyRequested} onChange={e => setFormData({...formData, surveyRequested: e.target.value})} className="h-11 rounded-xl bg-slate-50/50 border-slate-100" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Purpose of Access</Label>
              <Textarea required placeholder="Describe your data analysis goals..." value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="min-h-[100px] rounded-xl resize-none bg-slate-50/50 border-slate-100 text-sm" />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
