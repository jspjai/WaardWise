"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Mail, User, Building2, Phone, FileText, ArrowLeft, Loader2, CheckCircle2, Lock } from "lucide-react";
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
    password: "",
    phone: "",
    company: "",
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
      toast({ title: "Application Submitted", description: "Our team will review your request shortly." });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl overflow-hidden p-10 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Application Received</h2>
            <p className="text-slate-500 text-sm">We have received your request for portal access. You will receive an email confirmation once your organization is authorized.</p>
          </div>
          <Button onClick={onBack} className="w-full h-12 rounded-xl bg-primary font-bold">
            Return to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-2xl border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center border-b border-slate-50">
          <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold">Request Viewer Access</CardTitle>
            <CardDescription className="text-slate-500">Apply for a secure organization account to view intelligence reports.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="pl-11 h-12 rounded-xl bg-slate-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Organization / Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="pl-11 h-12 rounded-xl bg-slate-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="pl-11 h-12 rounded-xl bg-slate-50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="pl-11 h-12 rounded-xl bg-slate-50" />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-primary">Set Portal Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input required type="password" placeholder="Min 6 characters" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="pl-11 h-12 rounded-xl bg-slate-50 border-primary/20" />
              </div>
              <p className="text-[10px] text-slate-400 font-bold italic ml-1">This will be your login password upon approval.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Requested Dataset / Ward</Label>
              <Input required placeholder="e.g. Ward 80 - Indiranagar" value={formData.surveyRequested} onChange={e => setFormData({...formData, surveyRequested: e.target.value})} className="h-12 rounded-xl bg-slate-50" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Purpose of Access</Label>
              <Textarea required placeholder="Describe how you will use this data..." value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="min-h-[100px] rounded-2xl bg-slate-50 resize-none" />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={onBack} className="h-12 rounded-xl px-6 font-bold text-slate-500">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Access Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
