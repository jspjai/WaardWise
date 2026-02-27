"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  Star
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

  const RatingField = ({ label }: { label: string }) => (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-slate-700">{label}</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all font-bold"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );

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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Address / House Number</Label>
                  <Input placeholder="123, 4th Main..." className="bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Head of Family Name</Label>
                  <Input placeholder="Enter full name" className="bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Contact Number</Label>
                  <Input placeholder="+91 XXXXX XXXXX" className="bg-slate-50 border-slate-200" />
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

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Religion</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="christian">Christian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Mother Tongue</Label>
                  <Input placeholder="e.g. Kannada, Hindi, Telugu" className="bg-slate-50 border-slate-200" />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Total Voters in Household</Label>
                  <Input type="number" placeholder="0" className="bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Registered Voters at this Booth</Label>
                  <Input type="number" placeholder="0" className="bg-slate-50 border-slate-200" />
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
                      <Button type="button" variant="ghost" className="h-9 px-4 rounded-full severity-medium font-bold text-xs uppercase tracking-tight">Med</Button>
                      <Button type="button" variant="ghost" className="h-9 px-4 rounded-full severity-high font-bold text-xs uppercase tracking-tight">High</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 7 && (
              <div className="space-y-8">
                <RatingField label="Ward Member Performance" />
                <RatingField label="State Government Satisfaction" />
                <RatingField label="Central Government Satisfaction" />
              </div>
            )}

            {step === 8 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-bold text-slate-900">Preferred Local Leader</Label>
                  <RadioGroup className="space-y-3">
                    {["Candidate A", "Candidate B", "Candidate C", "Not Decided"].map((c) => (
                      <div key={c} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <RadioGroupItem value={c} id={c} />
                        <Label htmlFor={c} className="font-medium">{c}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Is the area safe for women after sunset?</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select safety level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-safe">Very Safe</SelectItem>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="unsafe">Unsafe</SelectItem>
                      <SelectItem value="very-unsafe">Very Unsafe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Specific Women's Issues (if any)</Label>
                  <Textarea className="bg-slate-50 border-slate-200" placeholder="Describe issues..." />
                </div>
              </div>
            )}

            {step === 10 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-bold text-slate-900">Political Lean</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {["Pro-Incumbency", "Anti-Incumbency", "Neutral", "Silent"].map((lean) => (
                      <button key={lean} type="button" className="p-4 text-left font-semibold bg-slate-50 border border-slate-200 rounded-xl hover:border-primary transition-colors">
                        {lean}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
