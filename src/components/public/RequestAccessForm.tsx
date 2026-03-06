
"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  Building2, 
  Mail, 
  User, 
  Lock, 
  MessageSquare,
  FileText
} from "lucide-react";

interface RequestAccessFormProps {
  onBack: () => void;
}

export function RequestAccessForm({ onBack }: RequestAccessFormProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    phone: "",
    surveyRequested: "",
    purpose: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    if (formData.password.length < 6) {
      toast({ title: "Security Requirement", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const requestId = `req_${Date.now()}`;
      await setDoc(doc(db, "viewer_requests", requestId), {
        id: requestId,
        ...formData,
        status: "PENDING",
        submittedAt: new Date().toISOString()
      });

      toast({ 
        title: "Application Submitted", 
        description: "Your request is under review. You will receive an email once approved." 
      });
      onBack();
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="absolute left-6 top-10 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <div className="mx-auto w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold">Request Viewer Access</CardTitle>
            <CardDescription className="text-slate-500">Apply for access to authorized ward datasets</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                    className="pl-11 h-12 rounded-xl" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Organization</Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required 
                    className="pl-11 h-12 rounded-xl" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                  className="pl-11 h-12 rounded-xl" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Portal Password (For Account Initialization)</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                  placeholder="Min 6 characters"
                  className="pl-11 h-12 rounded-xl" 
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">This password will be used to create your authorized account upon approval.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Specific Ward/Dataset Requested</Label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  value={formData.surveyRequested}
                  onChange={(e) => setFormData({...formData, surveyRequested: e.target.value})}
                  required 
                  placeholder="e.g. Indiranagar Ward 80"
                  className="pl-11 h-12 rounded-xl" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Purpose of Access</Label>
              <Textarea 
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                required 
                placeholder="Briefly explain how this data will be used..."
                className="min-h-[100px] rounded-xl resize-none" 
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {isSubmitting ? "Submitting Application..." : "Submit Access Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
