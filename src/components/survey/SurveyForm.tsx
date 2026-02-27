"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  User,
  Users,
  MessageSquare,
  ShieldAlert,
  Vote
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  "Booth Identification",
  "Household Identification",
  "Demographics",
  "Social & Community",
  "Voter Status",
  "Issue Priority",
  "Governance Perception",
  "Leadership",
  "Women & Safety",
  "Political Sentiment",
  "Field Notes"
];

export function SurveyForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = SECTIONS.length;
  const progress = (step / totalSteps) * 100;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-headline font-bold mb-4 text-slate-900">Survey Submitted!</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">Great work! The data has been securely saved and will be visible in the ward analysis dashboard shortly.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => { setIsSubmitted(false); setStep(1); }} className="bg-primary hover:bg-primary/90">
            Start New Survey
          </Button>
          <Button variant="outline">View Submissions</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header & Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Section {step} of {totalSteps}
            </span>
            <h1 className="font-headline font-bold text-2xl text-slate-900">{SECTIONS[step - 1]}</h1>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
          <CardContent className="pt-8 pb-10 px-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Ward Name</Label>
                    <Input placeholder="Enter ward name" className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Booth Number</Label>
                    <Input placeholder="e.g. 142" className="bg-slate-50 border-slate-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Polling Station Name</Label>
                  <Input placeholder="Enter station name" className="bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Area/Street Covered</Label>
                  <Input placeholder="Enter street details" className="bg-slate-50 border-slate-200" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-base font-bold text-slate-900">Gender</Label>
                  <RadioGroup defaultValue="male" className="flex flex-wrap gap-4">
                    {["Male", "Female", "Other"].map((val) => (
                      <div key={val} className="flex items-center space-x-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 hover:border-primary/50 cursor-pointer">
                        <RadioGroupItem value={val.toLowerCase()} id={val} />
                        <Label htmlFor={val} className="cursor-pointer font-medium">{val}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-base font-bold text-slate-900">Age Group</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["18-25", "26-40", "41-60", "60+"].map((age) => (
                      <button type="button" key={age} className="px-4 py-3 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-primary transition-all">
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground mb-4">Rate severity of issues in the local area</p>
                {["Water Supply", "Roads", "Drainage", "Garbage", "Safety"].map((issue) => (
                  <div key={issue} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                    <span className="font-semibold text-slate-800">{issue}</span>
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" className="h-9 px-4 rounded-full severity-low font-bold text-xs uppercase tracking-tight">Low</Button>
                      <Button type="button" variant="ghost" className="h-9 px-4 rounded-full severity-medium font-bold text-xs uppercase tracking-tight">Medium</Button>
                      <Button type="button" variant="ghost" className="h-9 px-4 rounded-full severity-high font-bold text-xs uppercase tracking-tight">High</Button>
                    </div>
                  </div>
                ))}
                <div className="space-y-2 mt-6">
                  <Label className="text-sm font-bold">Top 1 Local Issue (Free Text)</Label>
                  <Input placeholder="Describe the most critical issue..." className="h-12" />
                </div>
              </div>
            )}

            {step > 1 && step < 3 && <p className="text-slate-500 py-10 text-center">Step {step} form details for {SECTIONS[step-1]}...</p>}
            {step > 3 && step < 6 && <p className="text-slate-500 py-10 text-center">Step {step} form details for {SECTIONS[step-1]}...</p>}
            {step > 6 && step < 11 && <p className="text-slate-500 py-10 text-center">Step {step} form details for {SECTIONS[step-1]}...</p>}

            {step === 11 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Field Observer Notes</Label>
                  <Textarea placeholder="Enter your professional observations about the household or area..." className="min-h-[150px] resize-none" />
                </div>
                <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-3 border border-primary/10">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-primary/80 font-medium leading-relaxed">
                    AI Analysis: These notes will be processed by our sentiment engine to identify emerging trends automatically.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep} 
            disabled={step === 1}
            className="rounded-xl px-6 h-12"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 shadow-lg shadow-primary/20"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-emerald-200"
            >
              Finish & Submit
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
