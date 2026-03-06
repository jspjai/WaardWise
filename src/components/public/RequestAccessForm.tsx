
"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, ArrowLeft, Send, Loader2, Mail, User, Building2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestAccessFormProps {
  onBack: () => void;
}

export function RequestAccessForm({ onBack }: RequestAccessFormProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Collected for admin to initialize account
    company: "",
    phone: "",
    surveyRequested: "",
    purpose: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "viewer_requests"), {
        ...formData,
        status: "PENDING",
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      toast({ title: "Request Submitted", description: "Our team will review your application shortly." });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl text-center p-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <Send className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Request Sent!</h2>
          <p className="text-slate-500 text-sm mb-8">
            Thank you for your interest. We will review your application and notify you via email once your account is authorized.
          </p>
          <Button onClick={onBack} className="w-full h-12 rounded-xl bg-primary font-bold">
            Return to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center border-b border-slate-50">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold">Request Viewer Access</CardTitle>
            <CardDescription className="text-slate-500">Apply for a secure data intelligence account</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    required 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Company / Org</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    required 
                    placeholder="Candidate Office" 
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    required 
                    type="email" 
                    placeholder="name@email.com" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Portal Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    required 
                    type="password" 
                    placeholder="Min 6 characters" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Target Ward / Survey Interest</Label>
              <Input 
                required 
                placeholder="e.g. Ward 80 - Indiranagar" 
                value={formData.surveyRequested}
                onChange={e => setFormData({...formData, surveyRequested: e.target.value})}
                className="h-11 rounded-xl bg-slate-50 border-slate-100" 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Purpose of Access</Label>
              <Textarea 
                required 
                placeholder="Briefly explain why you need access to this data..." 
                value={formData.purpose}
                onChange={e => setFormData({...formData, purpose: e.target.value})}
                className="min-h-[100px] rounded-xl bg-slate-50 border-slate-100 resize-none" 
              />
            </div>

            <div className="pt-2 space-y-3">
              <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Submit Access Request
              </Button>
              <Button type="button" variant="ghost" onClick={onBack} className="w-full text-slate-400 hover:text-slate-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
