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
  Star,
  Home,
  Users,
  AlertTriangle,
  Building2
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

  const RatingField = ({ label, icon: Icon }: { label: string, icon?: any }) => (
    <div className="space-y-3 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <Label className="text-sm font-bold text-slate-800">{label}</Label>
      </div>
      <div className="flex justify-between gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            className="flex-1 h-11 rounded-lg border border-slate-200 flex flex-col items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all group"
          >
            <span className="text-sm font-bold">{num}</span>
            <span className="text-[8px] uppercase font-medium opacity-50 group-hover:opacity-100">
              {num === 1 ? 'Poor' : num === 5 ? 'Excel' : ''}
            </span>
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
          <Button onClick={() => { setIsSubmitted(false); setStep(1); }} className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-xl font-bold">
            Start New Survey
          </Button>
          <Button variant="outline" className="h-12 px-8 rounded-xl font-bold border-slate-200">
            View Submissions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Section {step} of {totalSteps}
            </span>
            <h1 className="font-headline font-bold text-2xl text-slate-900 tracking-tight">{SECTIONS[step - 1]}</h1>
          </div>
          <span className="text-xs font-bold text-slate-400">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-slate-100" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow-xl shadow-slate-200/40 bg-white rounded-2xl overflow-hidden">
          <CardContent className="pt-8 pb-10 px-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Ward Name</Label>
                    <Input placeholder="Enter ward name" className="bg-slate-50 border-slate-200 h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Booth Number</Label>
                    <Input placeholder="e.g. 142" className="bg-slate-50 border-slate-200 h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Polling Station Name</Label>
                  <Input placeholder="Enter station name" className="bg-slate-50 border-slate-200 h-11" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Address / House Number</Label>
                  <Input placeholder="123, 4th Main..." className="bg-slate-50 border-slate-200 h-11" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Head of Family Name</Label>
                    <Input placeholder="Enter full name" className="bg-slate-50 border-slate-200 h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Contact Number</Label>
                    <Input placeholder="+91 XXXXX XXXXX" className="bg-slate-50 border-slate-200 h-11" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Residence Type</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="own">Owned House</SelectItem>
                        <SelectItem value="rent">Rented</SelectItem>
                        <SelectItem value="lease">Lease</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Years in Locality</Label>
                    <Input type="number" placeholder="Years" className="bg-slate-50 border-slate-200 h-11" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-base font-bold text-slate-900">Gender of Respondent</Label>
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["18-25", "26-40", "41-60", "60+"].map((age) => (
                      <button type="button" key={age} className="px-4 py-3 text-sm font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-primary hover:text-primary transition-all">
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
                    <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="christian">Christian</SelectItem>
                      <SelectItem value="jain">Jain</SelectItem>
                      <SelectItem value="sikh">Sikh</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Mother Tongue</Label>
                  <Input placeholder="e.g. Kannada, Hindi, Telugu" className="bg-slate-50 border-slate-200 h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Caste Category (Optional)</Label>
                  <Input placeholder="e.g. General, OBC, SC/ST" className="bg-slate-50 border-slate-200 h-11" />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Total Voters in Household</Label>
                    <Input type="number" placeholder="0" className="bg-slate-50 border-slate-200 h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Male Voters</Label>
                    <Input type="number" placeholder="0" className="bg-slate-50 border-slate-200 h-11" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Female Voters</Label>
                    <Input type="number" placeholder="0" className="bg-slate-50 border-slate-200 h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Youth Voters (18-25)</Label>
                    <Input type="number" placeholder="0" className="bg-slate-50 border-slate-200 h-11" />
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <Label className="text-sm font-bold">Voting Behavior Pattern</Label>
                  <RadioGroup className="space-y-2">
                    {["Always Vote", "Occasionally Vote", "Rarely Vote", "First Time Voter"].map((p) => (
                      <div key={p} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <RadioGroupItem value={p.toLowerCase().replace(' ', '-')} id={p} />
                        <Label htmlFor={p} className="font-medium text-sm">{p}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <p className="text-xs font-bold text-slate-500 uppercase">Rate severity of local issues</p>
                </div>
                {["Water Supply", "Roads", "Drainage", "Garbage", "Electricity", "Public Transport"].map((issue) => (
                  <div key={issue} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                    <span className="font-bold text-slate-800 text-sm">{issue}</span>
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" className="h-9 px-4 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-[10px] uppercase">Low</Button>
                      <Button type="button" variant="ghost" className="h-9 px-4 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 font-bold text-[10px] uppercase">Med</Button>
                      <Button type="button" variant="ghost" className="h-9 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[10px] uppercase">High</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                <RatingField label="Ward Member Performance" icon={Users} />
                <RatingField label="Local MLA Satisfaction" icon={Building2} />
                <RatingField label="State Government Performance" icon={Building2} />
                <RatingField label="Central Government Satisfaction" icon={Building2} />
              </div>
            )}

            {step === 8 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-bold text-slate-900">Preferred Local Leader</Label>
                  <RadioGroup className="space-y-3">
                    {["Current Representative", "Challenger A", "Challenger B", "Independent", "Not Decided"].map((c) => (
                      <div key={c} className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary/30 transition-colors">
                        <RadioGroupItem value={c} id={c} />
                        <Label htmlFor={c} className="font-bold text-slate-700 flex-1 cursor-pointer">{c}</Label>
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
                    <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
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
                  <Textarea className="bg-slate-50 border-slate-200 min-h-[100px]" placeholder="Describe issues like lighting, patrolling, harassment hotspots..." />
                </div>
              </div>
            )}

            {step === 10 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-bold text-slate-900">Political Lean of Household</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {["Strongly Pro-Incumbency", "Slightly Pro-Incumbency", "Anti-Incumbency", "Neutral / Silent", "First Time Voters (Youth focus)"].map((lean) => (
                      <button key={lean} type="button" className="p-4 text-left font-bold bg-slate-50 border border-slate-200 rounded-xl hover:border-primary hover:bg-white hover:text-primary transition-all">
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
                  <Textarea placeholder="Enter your professional observations about the household attitude, specific complaints, or hidden trends..." className="min-h-[150px] resize-none bg-slate-50" />
                </div>
                <div className="bg-primary/5 p-5 rounded-2xl flex items-start gap-4 border border-primary/10">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary mb-1">AI-Powered Insights Enabled</h4>
                    <p className="text-xs text-primary/70 font-medium leading-relaxed">
                      Your notes are automatically analyzed for sentiment and emerging local issues. Be as descriptive as possible to improve ward-level accuracy.
                    </p>
                  </div>
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
            className="rounded-xl px-6 h-12 font-bold border-slate-200"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-primary/20"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-10 h-12 font-bold shadow-lg shadow-emerald-200"
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
