
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  Users,
  AlertTriangle,
  Building2,
  FileText,
  ShieldCheck,
  Star,
  Users2,
  Vote,
  Sparkles,
  Loader2,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { aiIssueSentimentExtractor, AiIssueSentimentExtractorOutput } from "@/ai/flows/ai-issue-sentiment-extractor";
import { Badge } from "@/components/ui/badge";

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiIssueSentimentExtractorOutput | null>(null);
  const [notes, setNotes] = useState("");
  const [topIssue, setTopIssue] = useState("");
  
  const totalSteps = SECTIONS.length;
  const progress = (step / totalSteps) * 100;

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  
  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleAiAnalysis = async () => {
    if (!notes) return;
    setIsAnalyzing(true);
    try {
      const result = await aiIssueSentimentExtractor({
        top1LocalIssue: topIssue || "General concerns",
        fieldObserverNotes: notes
      });
      setAiResult(result);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const RatingScale = ({ label, icon: Icon }: { label: string, icon?: any }) => (
    <div className="space-y-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <Label className="text-sm font-bold text-slate-800">{label}</Label>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            className="h-12 rounded-lg border border-slate-200 bg-white flex flex-col items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all group focus:bg-primary focus:text-white"
          >
            <span className="text-sm font-bold">{num}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center animate-in zoom-in-95 duration-500">
        <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-slate-900 tracking-tight">Survey Submitted!</h1>
        <p className="text-sm text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">Great work! The data has been securely saved and will be visible in the ward analysis dashboard shortly.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => { setIsSubmitted(false); setStep(1); setAiResult(null); setNotes(""); }} className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/10">
            Start New Survey
          </Button>
          <Button variant="outline" className="h-12 px-8 rounded-xl font-bold border-slate-200 text-slate-600">
            View Submissions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 md:py-8 px-2 md:px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 md:mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-2xl sticky top-16 md:top-20 z-20 border border-white/50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md w-fit">
              Section {step} of {totalSteps}
            </span>
            <h1 className="font-headline font-extrabold text-lg md:text-xl text-slate-900 tracking-tight">{SECTIONS[step - 1]}</h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{Math.round(progress)}% Complete</span>
            <Progress value={progress} className="h-1.5 w-24 bg-slate-100" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow-xl shadow-slate-200/30 bg-white rounded-3xl overflow-hidden">
          <CardContent className="pt-8 pb-10 px-5 md:px-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ward Name</Label>
                    <Input defaultValue="Indiranagar" className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Booth Number</Label>
                    <Input placeholder="e.g. 142" className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Polling Station Name</Label>
                  <Input placeholder="Enter station name" className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Address / House Number</Label>
                  <Input placeholder="123, 4th Main..." className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Head of Family</Label>
                    <Input placeholder="Enter full name" className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contact Number</Label>
                    <Input placeholder="+91 XXXXX XXXXX" className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Rate severity of local issues</p>
                </div>
                {["Water Supply", "Roads", "Drainage", "Garbage", "Electricity", "Public Transport"].map((issue) => (
                  <div key={issue} className="flex flex-col gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/20">
                    <span className="font-bold text-slate-800 text-sm">{issue}</span>
                    <div className="grid grid-cols-3 gap-2">
                      <Button type="button" variant="ghost" className="h-10 px-4 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-extrabold text-[10px] uppercase">Low</Button>
                      <Button type="button" variant="ghost" className="h-10 px-4 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 font-extrabold text-[10px] uppercase">Med</Button>
                      <Button type="button" variant="ghost" className="h-10 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-extrabold text-[10px] uppercase">High</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 10 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-sm font-bold text-slate-800">Likelihood to Vote for Incumbent Party</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Very Likely", "Likely", "Unlikely", "Undecided"].map((opt) => (
                      <Button key={opt} type="button" variant="outline" className="h-14 rounded-xl border-slate-200 hover:border-primary hover:text-primary transition-all font-bold text-xs uppercase">
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-bold text-slate-800">Top Local Issue</Label>
                  <Input 
                    placeholder="Briefly state the main concern" 
                    value={topIssue}
                    onChange={(e) => setTopIssue(e.target.value)}
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl" 
                  />
                </div>
              </div>
            )}

            {step === 11 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Field Observer Notes</Label>
                  <Textarea 
                    placeholder="Enter observations about household attitude or specific complaints..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[160px] md:min-h-[200px] resize-none bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm leading-relaxed" 
                  />
                </div>

                {notes.length > 20 && (
                  <Button 
                    type="button"
                    onClick={handleAiAnalysis}
                    disabled={isAnalyzing}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold shadow-lg gap-2"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    )}
                    {isAnalyzing ? "Analyzing Intelligence..." : "Run AI Sentiment Analysis"}
                  </Button>
                )}

                {aiResult && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-extrabold text-primary">AI Insights Extracted</h4>
                        </div>
                        <Badge className={cn(
                          "uppercase text-[10px] font-bold px-2 py-0.5",
                          aiResult.overallSentiment === 'Positive' ? 'bg-emerald-500' : 
                          aiResult.overallSentiment === 'Negative' ? 'bg-rose-500' : 'bg-slate-500'
                        )}>
                          {aiResult.overallSentiment} Sentiment
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Detected Issues</p>
                          <div className="flex flex-wrap gap-1.5">
                            {aiResult.keyLocalIssues.map((issue, i) => (
                              <Badge key={i} variant="outline" className="bg-white border-slate-100 text-slate-600 text-[10px] py-0">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Intelligence Summary</p>
                          <p className="text-xs text-slate-600 leading-relaxed italic">"{aiResult.summary}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!aiResult && !isAnalyzing && (
                  <div className="bg-amber-50 p-5 rounded-2xl flex items-start gap-4 border border-amber-100">
                    <div className="p-2 bg-amber-100 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-amber-700 mb-1">AI Recommendation</h4>
                      <p className="text-[11px] text-amber-600/70 font-semibold leading-relaxed">
                        Detailed notes allow our systems to detect early political shifts. Use the "Run AI Analysis" button above to verify your findings.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Standard Demographics / Social Steps Omitted for brevity in this mock view, assuming they follow the same pattern */}
            {![1, 2, 6, 10, 11].includes(step) && (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                   <FileText className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">Section details for {SECTIONS[step-1]}</p>
              </div>
            )}

          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4 pt-4 sticky bottom-4 z-30 bg-[#fcfcfd]/80 backdrop-blur-md p-2 rounded-2xl border border-white/50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep} 
            disabled={step === 1}
            className="flex-1 max-w-[140px] rounded-xl h-12 md:h-14 font-bold border-slate-200 text-slate-600 bg-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < totalSteps ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-12 md:h-14 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 md:h-14 font-bold shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02]"
            >
              Submit
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
