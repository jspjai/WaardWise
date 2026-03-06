
"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Mail, User, Building2, FileText, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestAccessFormProps {
  onBack: () => void;
}

export function RequestAccessForm({ onBack }: RequestAccessFormProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Temporary for account creation upon approval
    company: "",
    surveyRequested: "",
    purpose: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "viewer_requests"), {
        ...formData,
        status: 'PENDING',
        submittedAt: new Date().toISOString()
      });
      setIsSubmitted(true);
      toast({ title: "Request Submitted", description: "Our team will review your application shortly." });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl text-center p-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Request Sent!</h1>
          <p className="text-sm text-slate-500 mb-8">Your access request is being processed. You will receive an email once an administrator approves your account.</p>
          <Button onClick={onBack} className="w-full h-12 rounded-xl font-bold">
            Back to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 px-8">
          <Button variant="ghost" onClick={onBack} className="w-fit h-9 px-2 text-slate-400 hover:text-primary mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-extrabold">Request Viewer Access</CardTitle>
            <CardDescription className="text-slate-500">Apply for a secure organization portal account.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Desired Password</Label>
              <Input 
                type="password" 
                required 
                placeholder="Choose a secure password"
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="h-11 rounded-xl bg-slate-50 border-slate-100" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Organization / Party</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    required 
                    value={formData.company} 
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Target Ward / Area</Label>
                <Input 
                  required 
                  placeholder="e.g. Ward 80"
                  value={formData.surveyRequested} 
                  onChange={e => setFormData({...formData, surveyRequested: e.target.value})}
                  className="h-11 rounded-xl bg-slate-50 border-slate-100" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Purpose of Access</Label>
              <Textarea 
                required 
                placeholder="Explain why your organization needs access to this intelligence data..."
                value={formData.purpose} 
                onChange={e => setFormData({...formData, purpose: e.target.value})}
                className="min-h-[100px] rounded-xl bg-slate-50 border-slate-100 resize-none" 
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
