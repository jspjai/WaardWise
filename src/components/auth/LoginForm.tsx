"use client";

import { useState } from "react";
import { auth, db, isConfigValid } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle, UserCheck, Users, Briefcase } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Role, User } from "@/lib/types";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isConfigValid || !auth) {
      setError("Firebase is not configured. Please use 'Quick Access' buttons for local testing.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db!, "users", userCredential.user.uid), {
          id: userCredential.user.uid,
          email: email,
          name: email.split('@')[0],
          role: "SURVEYOR",
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock login for prototype testing when Firebase is not connected
  const handleQuickAccess = (email: string, role: Role) => {
    // In a real app, this would trigger sign-in.
    // Since we're in prototype mode, we'll "pretend" login if keys are missing
    // by triggering a custom event or relying on the parent to handle the user state.
    // For this prototype, we'll set the inputs and let the user know they can use Demo Mode 
    // or we can force a local "mock login" by using a window event or similar.
    
    // Better yet: we'll use a hack to update the parent Home component's state
    // by calling a function passed via props if we had it, but since we don't,
    // we'll just set the fields and show a message.
    
    setEmail(email);
    setPassword("password123");
    
    if (!isConfigValid) {
      setError(`Firebase is unconfigured. Refresh and use 'Launch Demo Mode' on the start screen to test the ${role.toLowerCase()} interface.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-headline font-extrabold tracking-tight">
              TRS <span className="text-primary">Group</span>
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isSignUp ? "Create your professional account" : "Sign in to access ward intelligence"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="rounded-xl bg-red-50 border-red-100 text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <AlertDescription className="text-[11px] font-bold uppercase tracking-tight ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  type="email" 
                  placeholder="name@trsgroup.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>

            {!isSignUp && (
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">Prototype Quick Access</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleQuickAccess("admin@trsgroup.com", "ADMIN")}
                    className="h-11 rounded-xl border-slate-100 text-slate-600 font-bold text-xs justify-start px-4 gap-3"
                  >
                    <UserCheck className="w-4 h-4 text-primary" />
                    Admin Access (Intel Hub)
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleQuickAccess("rahul@trsgroup.com", "SURVEYOR")}
                    className="h-11 rounded-xl border-slate-100 text-slate-600 font-bold text-xs justify-start px-4 gap-3"
                  >
                    <Users className="w-4 h-4 text-emerald-500" />
                    Surveyor Access (Field App)
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleQuickAccess("vikram@trsgroup.com", "CANDIDATE")}
                    className="h-11 rounded-xl border-slate-100 text-slate-600 font-bold text-xs justify-start px-4 gap-3"
                  >
                    <Briefcase className="w-4 h-4 text-amber-500" />
                    Candidate Access (Marketplace)
                  </Button>
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
