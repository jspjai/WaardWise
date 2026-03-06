
"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestAccessFormProps {
  onBack: () => void;
}

export function RequestAccessForm({ onBack }: RequestAccessFormProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
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
        submittedAt: new Date().toISOString()
      });
      setIsDone(true);
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full text-center p-10 rounded-3xl border-none shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold">Request Submitted</h2>
          <p className="text-slate-500 mt-4 leading-relaxed">Your application for viewer access has been received. Our admin team will review it and contact you via email with credentials once approved.</p>
          <Button onClick={onBack} className="mt-8 w-full h-12 rounded-xl">Return to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary text-white p-8">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 p-0 h-8 w-8 mb-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <CardTitle className="text-2xl font-bold">Viewer Access Request</CardTitle>
          <CardDescription className="text-primary-foreground/80">Submit your credentials for professional survey intelligence access.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Company / Organization</Label>
                <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required className="rounded-xl h-11" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Professional Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Number</Label>
                <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required className="rounded-xl h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Requested Survey Dataset</Label>
              <Input placeholder="e.g. Ward 80 Voter Mood Q1" value={formData.surveyRequested} onChange={e => setFormData({...formData, surveyRequested: e.target.value})} required className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Purpose of Access</Label>
              <Textarea value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} required className="rounded-xl min-h-[100px]" />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-primary rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
              {isSubmitting ? "Processing..." : "Submit Access Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
