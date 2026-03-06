
"use client";

import { useState } from "react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle, FileText, KeyRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onShowRequest: () => void;
}

export function LoginForm({ onShowRequest }: LoginFormProps) {
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!auth || !resetEmail) {
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({ title: "Reset Link Sent", description: "Check your inbox for password recovery instructions." });
      setIsResetDialogOpen(false);
      setResetEmail("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold">Secure Login</CardTitle>
            <CardDescription className="text-slate-500">TRS Group Survey Intelligence Platform</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-bold ml-2">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-11 h-12 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</Label>
                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <DialogTrigger asChild>
                    <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot Password?</button>
                  </DialogTrigger>
                  <DialogContent className="rounded-3xl border-none">
                    <DialogHeader>
                      <DialogTitle className="font-headline font-bold">Recover Password</DialogTitle>
                      <DialogDescription>
                        Enter the email address associated with your account to receive a reset link.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Email Address</Label>
                      <Input 
                        placeholder="email@example.com" 
                        value={resetEmail} 
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="h-12 rounded-xl bg-slate-50 border-slate-100"
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleForgotPassword} disabled={isResetting} className="w-full h-12 bg-primary rounded-xl font-bold">
                        {isResetting ? <Loader2 className="animate-spin mr-2" /> : <KeyRound className="w-4 h-4 mr-2" />}
                        Send Reset Instructions
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-11 h-12 rounded-xl" />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20">
              {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
            <div className="text-center pt-4 border-t mt-6">
              <p className="text-xs text-slate-400 mb-3 uppercase font-bold tracking-widest">Need Access?</p>
              <Button variant="outline" type="button" onClick={onShowRequest} className="w-full h-12 rounded-xl border-dashed">
                <FileText className="w-4 h-4 mr-2" />
                Request Viewer Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
