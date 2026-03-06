"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Send, CheckCircle2, ShieldCheck, Mail, Building2, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestAccessFormProps {
  onBack: () => void;
}

export function RequestAccessForm({ onBack }: RequestAccessFormProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    password: "", 
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
        status: 'PENDING',
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      toast({ title: "Application Submitted", description: "An administrator will review your request shortly." });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl overflow-hidden text-center">
          <CardContent className="pt-12 pb-12 px-8 space-y-6">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold">Request Sent</h2>
            <p className="text-slate-500 text-sm">Your application has been received. We will contact you at <b>{formData.email}</b> once your account is ready.</p>
            <Button onClick={onBack} className="w-full h-12 bg-primary rounded-xl font-bold">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center bg-slate-50/50 relative">
          <div className="flex justify-start absolute top-6 left-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="rounded-full hover:bg-slate-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>
          <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold">Request Viewer Access</CardTitle>
            <CardDescription className="text-slate-500 text-sm">Submit your credentials for data portal authorization.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10 pt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="pl-9 h-11 rounded-xl" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Organization</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="pl-9 h-11 rounded-xl" placeholder="Company Ltd" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="pl-9 h-11 rounded-xl" placeholder="name@org.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Set Portal Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="pl-9 h-11 rounded-xl" placeholder="Min 6 chars" minLength={6} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Target Ward/Dataset</Label>
              <Input required value={formData.surveyRequested} onChange={e => setFormData({...formData, surveyRequested: e.target.value})} className="h-11 rounded-xl" placeholder="e.g. Ward 80 - Indiranagar" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Purpose of Access</Label>
              <Textarea required value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="min-h-[100px] rounded-xl resize-none" placeholder="How will you use this political intelligence?" />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20 mt-4">
              {isLoading ? <Send className="animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}