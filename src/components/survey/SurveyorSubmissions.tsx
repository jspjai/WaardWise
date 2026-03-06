"use client";

import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, useUser, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  MoreVertical, 
  CheckCircle2, 
  MapPin,
  Calendar,
  Loader2,
  AlertTriangle,
  User,
  Home,
  FileText,
  TrendingUp,
  ShieldCheck,
  Building2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SEVERITY_OPTIONS = ["Low", "Medium", "High"];

export function SurveyorSubmissions() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  // Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});

  const submissionsQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "surveys"), where("surveyorId", "==", user.uid));
  }, [db, user]);

  const { data: submissions, isLoading } = useCollection(submissionsQuery);

  const triggerDelete = (survey: any) => {
    setSelectedSurvey(survey);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!db || !selectedSurvey) return;
    const docRef = doc(db, "surveys", selectedSurvey.id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Survey Deleted", description: "The record has been removed from history." });
    setDeleteDialogOpen(false);
    setSelectedSurvey(null);
  };

  const triggerEdit = (survey: any) => {
    setSelectedSurvey(survey);
    setEditData({ ...survey });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!db || !selectedSurvey) return;
    const docRef = doc(db, "surveys", selectedSurvey.id);
    updateDocumentNonBlocking(docRef, {
      ...editData,
      updatedAt: new Date().toISOString()
    });
    toast({ title: "Survey Updated", description: "Changes have been saved successfully." });
    setEditDialogOpen(false);
    setSelectedSurvey(null);
    setEditData({});
  };

  const handleCloseEdit = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setSelectedSurvey(null);
      setEditData({});
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">My Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">History of all surveys you have conducted.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search household..." className="pl-10 bg-white border-slate-100 h-11 rounded-xl" />
          </div>
          <Button variant="outline" className="rounded-xl h-11 border-slate-100 bg-white">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 md:hidden gap-4">
            {submissions?.map((sub: any) => (
              <Card key={sub.id} className="border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{sub.respondentName || "Household"}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">ID: {sub.id.slice(0, 8)}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => triggerEdit(sub)} className="font-bold text-xs cursor-pointer">
                          <Edit className="w-3 h-3 mr-2" /> Edit Record
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => triggerDelete(sub)} className="font-bold text-xs text-red-500 cursor-pointer">
                          <Trash2 className="w-3 h-3 mr-2" /> Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-300" />
                      Booth {sub.boothNumber || sub.boothId}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      {new Date(sub.surveyDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                      sub.householdVoterMood === "Pro-change" ? "bg-primary/10 text-primary" : 
                      sub.householdVoterMood === "Pro-continuity" ? "bg-emerald-50 text-emerald-600" : 
                      "bg-slate-100 text-slate-600"
                    )}>
                      {sub.householdVoterMood}
                    </span>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold px-2 py-0.5">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Synced
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden md:block border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Household</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Booth</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Date</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Sentiment</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions?.map((sub: any) => (
                  <TableRow key={sub.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-bold text-slate-500 text-xs">{sub.id.slice(0, 8)}</TableCell>
                    <TableCell className="font-bold text-slate-900">{sub.respondentName || "Household"}</TableCell>
                    <TableCell className="font-medium text-slate-600">{sub.boothNumber || sub.boothId}</TableCell>
                    <TableCell className="text-slate-500 text-xs">{new Date(sub.surveyDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                        sub.householdVoterMood === "Pro-change" ? "bg-primary/10 text-primary" : 
                        sub.householdVoterMood === "Pro-continuity" ? "bg-emerald-50 text-emerald-600" : 
                        "bg-slate-100 text-slate-600"
                      )}>
                        {sub.householdVoterMood}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600">Synced</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => triggerEdit(sub)} className="font-bold text-xs cursor-pointer">
                            <Edit className="w-3 h-3 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => triggerDelete(sub)} className="font-bold text-xs text-red-500 cursor-pointer">
                            <Trash2 className="w-3 h-3 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(!submissions || submissions.length === 0) && (
              <div className="py-12 text-center">
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No submissions yet</p>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Edit Dialog - Full 7 section coverage */}
      <Dialog open={editDialogOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-3xl border-none">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="font-headline font-bold text-xl">Full Survey Edit</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Refine details from all 7 survey sections.</DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-8 py-4">
              {/* Section 1: Booth Identification */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Building2 className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">1. Booth Identification</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Ward ID</Label>
                    <Input value={editData.wardId || ""} readOnly className="h-11 rounded-xl bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Booth Number</Label>
                    <Input 
                      value={editData.boothNumber || ""} 
                      onChange={(e) => setEditData({ ...editData, boothNumber: e.target.value })}
                      className="h-11 rounded-xl bg-white border-slate-100" 
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Section 2: Household Identification */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Home className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">2. Household Identification</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Respondent Name</Label>
                    <Input 
                      value={editData.respondentName || ""} 
                      onChange={(e) => setEditData({ ...editData, respondentName: e.target.value })}
                      className="h-11 rounded-xl bg-white border-slate-100" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Address / Landmark</Label>
                    <Input 
                      value={editData.houseNumberLandmark || ""} 
                      onChange={(e) => setEditData({ ...editData, houseNumberLandmark: e.target.value })}
                      className="h-11 rounded-xl bg-white border-slate-100" 
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Section 3: Demographics */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <User className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">3. Demographics</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Gender</Label>
                    <Select value={editData.gender} onValueChange={(val) => setEditData({ ...editData, gender: val })}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Age Group</Label>
                    <Select value={editData.ageGroup} onValueChange={(val) => setEditData({ ...editData, ageGroup: val })}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18–25">18–25</SelectItem>
                        <SelectItem value="26–40">26–40</SelectItem>
                        <SelectItem value="41–60">41–60</SelectItem>
                        <SelectItem value="60+">60+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Language</Label>
                    <Input value={editData.languageSpokenAtHome || ""} onChange={(e) => setEditData({ ...editData, languageSpokenAtHome: e.target.value })} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Residency</Label>
                    <Select value={editData.yearsLivingInArea} onValueChange={(val) => setEditData({ ...editData, yearsLivingInArea: val })}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
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

              <Separator />

              {/* Section 4: Voter Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">4. Voter Status</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Male Count</Label>
                    <Input type="number" value={editData.householdMaleVoterCount || 0} onChange={(e) => setEditData({ ...editData, householdMaleVoterCount: parseInt(e.target.value) || 0 })} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Female Count</Label>
                    <Input type="number" value={editData.householdFemaleVoterCount || 0} onChange={(e) => setEditData({ ...editData, householdFemaleVoterCount: parseInt(e.target.value) || 0 })} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Youth Count</Label>
                    <Input type="number" value={editData.householdYouthVoterCount || 0} onChange={(e) => setEditData({ ...editData, householdYouthVoterCount: parseInt(e.target.value) || 0 })} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Behavior</Label>
                    <Select value={editData.votingBehavior} onValueChange={(val) => setEditData({ ...editData, votingBehavior: val })}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Always vote">Always vote</SelectItem>
                        <SelectItem value="Sometimes vote">Sometimes vote</SelectItem>
                        <SelectItem value="Rarely vote">Rarely vote</SelectItem>
                        <SelectItem value="Never vote">Never vote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Section 5: Issue Priority */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">5. Issue Priority (Severity)</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { id: "waterSupplySeverity", label: "Water Supply" },
                    { id: "roadsSeverity", label: "Road Quality" },
                    { id: "drainageSeverity", label: "Drainage" },
                    { id: "garbageSeverity", label: "Garbage" },
                    { id: "safetySeverity", label: "Safety" }
                  ].map((issue) => (
                    <div key={issue.id} className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-600">{issue.label}</Label>
                      <div className="flex gap-1">
                        {SEVERITY_OPTIONS.map((opt) => (
                          <Button
                            key={opt}
                            type="button"
                            variant={editData[issue.id] === opt ? "default" : "outline"}
                            size="sm"
                            onClick={() => setEditData({ ...editData, [issue.id]: opt })}
                            className="flex-1 h-9 rounded-lg text-[10px] uppercase font-bold"
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Section 6 & 7: Sentiment and Notes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">6 & 7. Sentiment & Notes</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Voter Mood</Label>
                    <Select value={editData.householdVoterMood} onValueChange={(val) => setEditData({ ...editData, householdVoterMood: val })}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pro-change">Pro-change</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                        <SelectItem value="Pro-continuity">Pro-continuity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Top Local Issue</Label>
                    <Input 
                      value={editData.topIssue || ""} 
                      onChange={(e) => setEditData({ ...editData, topIssue: e.target.value })}
                      className="h-11 rounded-xl" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Observer Notes</Label>
                  <Textarea 
                    value={editData.notes || ""} 
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    className="min-h-[120px] rounded-xl bg-slate-50 border-slate-100 resize-none" 
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t bg-slate-50/50">
            <Button variant="ghost" onClick={() => handleCloseEdit(false)} className="rounded-xl h-12 font-bold px-8">Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-primary rounded-xl h-12 px-12 font-bold shadow-lg shadow-primary/10">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Commit Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Remove Survey?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm">
              Are you sure you want to delete the survey for <strong>{selectedSurvey?.respondentName}</strong>? This will permanently remove it from ward analytics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl h-12 font-bold border-slate-100">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="rounded-xl h-12 px-8 font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-rose-100"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
