
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
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="max-w-xl rounded-3xl border-none">
          <DialogHeader>
            <DialogTitle className="font-headline font-bold text-xl">Edit Survey Record</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Update the respondent details or field observations.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Respondent Name</Label>
              <Input 
                value={editData.respondentName || ""}
                onChange={(e) => setEditData({ ...editData, respondentName: e.target.value })}
                className="h-11 rounded-xl bg-slate-50 border-slate-100"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Voter Mood</Label>
              <Select value={editData.householdVoterMood} onValueChange={(val) => setEditData({ ...editData, householdVoterMood: val })}>
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pro-change">Pro-change</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Pro-continuity">Pro-continuity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Top Local Issue</Label>
              <Input 
                value={editData.topIssue || ""}
                onChange={(e) => setEditData({ ...editData, topIssue: e.target.value })}
                className="h-11 rounded-xl bg-slate-50 border-slate-100"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Observer Notes</Label>
              <Textarea 
                value={editData.notes || ""}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                className="min-h-[120px] rounded-xl bg-slate-50 border-slate-100 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => handleCloseEdit(false)} className="rounded-xl h-12 font-bold">Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-primary rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/10">
              Save Changes
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
