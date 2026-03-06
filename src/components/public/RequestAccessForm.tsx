
"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Mail, User, Building2, MessageSquare, Loader2, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
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
    password: "", // Stored for admin to create account
    company: "",
    phone: "",
    surveyRequested: "",
    purpose: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setIsLoading(true);
    try {
      await addDoc(collection(db, "viewer_requests"), {
        ...formData,
        status: "PENDING",
        submittedAt: new Date().toISOString()
      });
      setIsSubmitted(true);
      toast({ title: "Application Submitted", description: "Our team will review your request shortly." });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl overflow-hidden text-center p-10 space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Request Received</h2>
            <p className="text-slate-500 text-sm">We have received your application for viewer access. You will be notified via email once approved.</p>
          </div>
          <Button onClick={onBack} className="w-full h-12 bg-primary rounded-xl font-bold">
            Return to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 px-8">
          <Button variant="ghost" size="sm" onClick={onBack} className="w-fit h-8 rounded-lg -ml-2 text-slate-400 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-extrabold">Apply for Access</CardTitle>
            <CardDescription className="text-slate-500">Request a viewer account for the Intelligence Portal</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50/50 border-slate-100" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50/50 border-slate-100" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Portal Password (For your new account)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input 
                  type="password" 
                  required 
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="pl-9 h-11 rounded-xl bg-slate-50/50 border-slate-100" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Company / Organization</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    required 
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50/50 border-slate-100" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Ward Interest</Label>
                <Input 
                  required 
                  placeholder="e.g. Ward 80, 82"
                  value={formData.surveyRequested}
                  onChange={e => setFormData({...formData, surveyRequested: e.target.value})}
                  className="h-11 rounded-xl bg-slate-50/50 border-slate-100" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Business Purpose</Label>
              <Textarea 
                required 
                placeholder="Explain why you need access to this data..."
                value={formData.purpose}
                onChange={e => setFormData({...formData, purpose: e.target.value})}
                className="min-h-[100px] rounded-xl bg-slate-50/50 border-slate-100 resize-none" 
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20">
              {isLoading ? <Loader2 className="animate-spin" /> : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
