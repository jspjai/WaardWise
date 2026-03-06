
"use client";

import { useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, Send, Loader2, User, Building2, Mail, Lock, Phone, MessageSquare } from "lucide-react";
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
    company: "",
    email: "",
    phone: "",
    password: "",
    surveyRequested: "",
    purpose: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    setIsSubmitting(true);
    try {
      const requestId = `req_${Date.now()}`;
      await setDoc(doc(db, "viewer_requests", requestId), {
        ...formData,
        id: requestId,
        status: 'PENDING',
        submittedAt: new Date().toISOString()
      });

      setIsSuccess(true);
      toast({ title: "Request Submitted", description: "Your application is being reviewed by our team." });
    } catch (error: any) {
      toast({ 
        title: "Submission Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl text-center p-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <Send className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Received</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Our strategic team will review your organization's request for ward intelligence. You will receive an email once access is authorized.
          </p>
          <Button onClick={onBack} className="w-full h-12 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20">
            Back to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center relative">
          <button 
            onClick={onBack}
            className="absolute left-6 top-10 p-2 text-slate-400 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <User className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold">Request Viewer Access</CardTitle>
            <CardDescription className="text-slate-500">Apply for organizational intelligence credentials.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    required 
                    placeholder="Candidate Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Organization</Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    required 
                    placeholder="Company/Party"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  required 
                  type="email"
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-100" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Desired Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    required 
                    type="password"
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Contact Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    required 
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-100" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Target Ward / Region</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  required 
                  placeholder="e.g. Ward 80 - Indiranagar"
                  value={formData.surveyRequested}
                  onChange={(e) => setFormData({...formData, surveyRequested: e.target.value})}
                  className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-100" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Purpose of Analysis</Label>
              <Textarea 
                required 
                placeholder="Briefly describe your intelligence requirements..."
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="h-24 rounded-xl bg-slate-50 border-slate-100 resize-none" 
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-4 h-4" />}
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
