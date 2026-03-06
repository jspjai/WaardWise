
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  FileText,
  Sparkles,
  Loader2,
  TrendingUp,
  User,
  MapPin,
  AlertTriangle,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { aiIssueSentimentExtractor, AiIssueSentimentExtractorOutput } from "@/ai/flows/ai-issue-sentiment-extractor";
import { Badge } from "@/components/ui/badge";

const SECTIONS = [
  "Booth Identification",
  "Household Identification",
  "Demographics",
  "Voter Status",
  "Issue Priority",
  "Political Sentiment",
  "Field Notes"
];

const SEVERITY_OPTIONS = ["Low", "Medium", "High"];

interface SurveyFormProps {
  onNavigate?: (view: string) => void;
}

export function SurveyForm({ onNavigate }: SurveyFormProps) {
  const { user } = useUser();
  const db = useFirestore();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiIssueSentimentExtractorOutput | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    wardId: "ward-80",
    boothId: "",
    boothNumber: "",
    respondentName: "",
    houseNumberLandmark: "",
    gender: "Male",
    ageGroup: "26–40",
    languageSpokenAtHome: "Kannada",
    yearsLivingInArea: "10+ Years",
    householdMaleVoterCount: 1,
    householdFemaleVoterCount: 1,
    householdYouthVoterCount: 0,
    votingBehavior: "Always vote",
    waterSupplySeverity: "Medium",
    roadsSeverity: "Medium",
    drainageSeverity: "Medium",
    garbageSeverity: "Medium",
    safetySeverity: "Medium",
    householdVoterMood: "Neutral",
    topIssue: "",
    notes: "",
    surveyDate: "" // Initialize empty to avoid hydration mismatch
  });

  useEffect(() => {
    // Set survey date only on client side after initial hydration
    setFormData(prev => ({
      ...prev,
      surveyDate: new Date().toISOString()
    }));
  }, []);
  
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

  const handleAiAnalysis = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.notes) return;
    setIsAnalyzing(true);
    try {
      const result = await aiIssueSentimentExtractor({
        top1LocalIssue: formData.topIssue || "General concerns",
        fieldObserverNotes: formData.notes
      });
      setAiResult(result);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    
    setIsSubmitting(true);
    const surveysCol = collection(db, "surveys");
    
    const surveyPayload = {
      ...formData,
      surveyorId: user.uid,
      submissionTimestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      top1LocalIssue: formData.topIssue,
      observerNotes: formData.notes
    };

    try {
      await addDocumentNonBlocking(surveysCol, surveyPayload);
      setIsSubmitted(true);
      
      if (onNavigate) {
        setTimeout(() => {
          onNavigate("My Surveys");
        }, 3000);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center animate-in zoom-in-95 duration-500">
        <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-slate-900 tracking-tight">Survey Submitted!</h1>
        <p className="text-sm text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">Great work! The data has been securely saved. You will be redirected to your submission history in a few seconds.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            type="button" 
            onClick={() => { setIsSubmitted(false); setStep(1); setAiResult(null); }} 
            className="bg-primary hover:bg-primary/90 h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20"
          >
            Start New Survey
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => onNavigate?.("My Surveys")}
            className="h-12 px-8 rounded-xl font-bold border-slate-200"
          >
            <History className="w-4 h-4 mr-2" />
            View My Submissions
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

      <div className="space-y-6">
        <Card className="border-none shadow-xl shadow-slate-200/30 bg-white rounded-3xl overflow-hidden">
          <CardContent className="pt-8 pb-10 px-5 md:px-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ward ID</Label>
                    <Input readOnly value={formData.wardId} className="bg-slate-50 border-slate-100 h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Booth Number</Label>
                    <Input 
                      placeholder="e.g. 142" 
                      value={formData.boothNumber}
                      onChange={(e) => setFormData({...formData, boothNumber: e.target.value, boothId: `booth-${e.target.value}`})}
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl" 
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Address / House Number</Label>
                  <Input 
                    placeholder="123, 4th Main..." 
                    value={formData.houseNumberLandmark}
                    onChange={(e) => setFormData({...formData, houseNumberLandmark: e.target.value})}
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Respondent Name</Label>
                  <Input 
                    placeholder="Enter full name" 
                    value={formData.respondentName}
                    onChange={(e) => setFormData({...formData, respondentName: e.target.value})}
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl" 
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender</Label>
                    <Select value={formData.gender} onValueChange={(val) => setFormData({...formData, gender: val})}>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Age Group</Label>
                    <Select value={formData.ageGroup} onValueChange={(val) => setFormData({...formData, ageGroup: val})}>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                        <SelectValue placeholder="Select Age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18–25">18–25</SelectItem>
                        <SelectItem value="26–40">26–40</SelectItem>
                        <SelectItem value="41–60">41–60</SelectItem>
                        <SelectItem value="60+">60+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Language</Label>
                    <Input 
                      placeholder="e.g. Kannada" 
                      value={formData.languageSpokenAtHome}
                      onChange={(e) => setFormData({...formData, languageSpokenAtHome: e.target.value})}
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Years in Area</Label>
                    <Select value={formData.yearsLivingInArea} onValueChange={(val) => setFormData({...formData, yearsLivingInArea: val})}>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                        <SelectValue placeholder="Residency Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="< 1 Year">&lt; 1 Year</SelectItem>
                        <SelectItem value="1-5 Years">1-5 Years</SelectItem>
                        <SelectItem value="5-10 Years">5-10 Years</SelectItem>
                        <SelectItem value="10+ Years">10+ Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Male Voters</Label>
                    <Input 
                      type="number"
                      value={formData.householdMaleVoterCount}
                      onChange={(e) => setFormData({...formData, householdMaleVoterCount: parseInt(e.target.value) || 0})}
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Female Voters</Label>
                    <Input 
                      type="number"
                      value={formData.householdFemaleVoterCount}
                      onChange={(e) => setFormData({...formData, householdFemaleVoterCount: parseInt(e.target.value) || 0})}
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Youth Voters</Label>
                    <Input 
                      type="number"
                      value={formData.householdYouthVoterCount}
                      onChange={(e) => setFormData({...formData, householdYouthVoterCount: parseInt(e.target.value) || 0})}
                      className="bg-slate-50 border-slate-100 h-12 rounded-xl" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Voting Behavior</Label>
                  <Select value={formData.votingBehavior} onValueChange={(val) => setFormData({...formData, votingBehavior: val})}>
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Always vote">Always vote</SelectItem>
                      <SelectItem value="Sometimes vote">Sometimes vote</SelectItem>
                      <SelectItem value="Rarely vote">Rarely vote</SelectItem>
                      <SelectItem value="Never vote">Never vote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                {[
                  { id: "waterSupplySeverity", label: "Water Supply" },
                  { id: "roadsSeverity", label: "Road Quality" },
                  { id: "drainageSeverity", label: "Drainage System" },
                  { id: "garbageSeverity", label: "Garbage Management" },
                  { id: "safetySeverity", label: "Public Safety" }
                ].map((issue) => (
                  <div key={issue.id} className="space-y-3">
                    <Label className="text-sm font-bold text-slate-800">{issue.label} Concern Level</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {SEVERITY_OPTIONS.map((opt) => (
                        <Button
                          key={opt}
                          type="button"
                          variant={formData[issue.id as keyof typeof formData] === opt ? "default" : "outline"}
                          onClick={() => setFormData({...formData, [issue.id]: opt})}
                          className={cn(
                            "h-11 rounded-xl text-xs font-bold uppercase transition-all",
                            formData[issue.id as keyof typeof formData] === opt ? "shadow-md" : "bg-slate-50/50"
                          )}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-sm font-bold text-slate-800">Political Sentiment</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["Pro-change", "Neutral", "Pro-continuity"].map((opt) => (
                      <Button 
                        key={opt} 
                        type="button" 
                        variant={formData.householdVoterMood === opt ? "default" : "outline"} 
                        onClick={() => setFormData({...formData, householdVoterMood: opt})}
                        className="h-14 rounded-xl font-bold text-xs uppercase"
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-bold text-slate-800">Top Local Issue</Label>
                  <Input 
                    placeholder="Main concern (e.g. Water Scarcity)" 
                    value={formData.topIssue}
                    onChange={(e) => setFormData({...formData, topIssue: e.target.value})}
                    className="bg-slate-50 border-slate-100 h-12 rounded-xl" 
                  />
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Field Observer Notes</Label>
                  <Textarea 
                    placeholder="Observations about household attitude or specific complaints..." 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="min-h-[160px] md:min-h-[200px] resize-none bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm leading-relaxed" 
                  />
                </div>

                {formData.notes.length > 20 && (
                  <Button 
                    type="button"
                    onClick={handleAiAnalysis}
                    disabled={isAnalyzing}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold shadow-lg gap-2"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                    {isAnalyzing ? "Analyzing..." : "Run AI Sentiment Analysis"}
                  </Button>
                )}

                {aiResult && (
                  <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-extrabold text-primary">AI Insights</h4>
                      </div>
                      <Badge className={cn(
                        "uppercase text-[10px] font-bold px-2 py-0.5",
                        aiResult.overallSentiment === 'Positive' ? 'bg-emerald-500' : 
                        aiResult.overallSentiment === 'Negative' ? 'bg-rose-500' : 'bg-slate-500'
                      )}>
                        {aiResult.overallSentiment}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{aiResult.summary}"</p>
                  </div>
                )}
              </div>
            )}

          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4 pt-4 sticky bottom-4 z-30 bg-[#fcfcfd]/80 backdrop-blur-md p-2 rounded-2xl border border-white/50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep} 
            disabled={step === 1 || isSubmitting}
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
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 md:h-14 font-bold shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
