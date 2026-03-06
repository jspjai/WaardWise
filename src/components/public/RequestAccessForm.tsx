"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, CheckCircle2, ShieldCheck, Mail, User, Building2, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestAccessFormProps {
  onBack: () => void;
}

export function RequestAccessForm({ onBack }: RequestAccessFormProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // User suggests their initial password
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
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      toast({ title: "Application Sent", description: "Your request is being reviewed by the TRS admin team." });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl p-10 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Request Received</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Thank you for applying for a Viewer account. Our security team will review your credentials and contact you via <b>{formData.email}</b> once approved.
          </p>
          <Button onClick={onBack} className="w-full h-12 rounded-xl bg-primary font-bold">
            Back to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-xl border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="p-8 pb-4 text-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="absolute left-6 top-8 text-slate-400">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-extrabold">Request Viewer Access</CardTitle>
          <CardDescription>Apply for access to ward-level survey intelligence.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="pl-9 h-11 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Organization / Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="pl-9 h-11 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="pl-9 h-11 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-400">Portal Password (Requested)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="password" required placeholder="Min 6 chars" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="pl-9 h-11 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-400">Ward or Dataset Interest</Label>
              <Input required placeholder="e.g. Indiranagar Ward 80" value={formData.surveyRequested} onChange={e => setFormData({...formData, surveyRequested: e.target.value})} className="h-11 rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-400">Purpose of Access</Label>
              <Textarea required placeholder="Describe how you will use this political data..." value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="rounded-xl min-h-[100px] bg-slate-50 border-slate-100" />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Submit Access Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
