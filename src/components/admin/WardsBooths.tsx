
"use client";

import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Map, 
  Search, 
  Plus, 
  MoreVertical, 
  ChevronRight,
  Users,
  Building2,
  Filter,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Ward } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function WardsBooths() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWard, setNewWard] = useState({ id: "", name: "", district: "", price: 5000 });

  const wardsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "wards");
  }, [db]);

  const { data: wards, isLoading } = useCollection<Ward>(wardsQuery);

  const handleAddWard = async () => {
    if (!db || !newWard.id || !newWard.name || !newWard.district) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    try {
      await setDoc(doc(db, "wards", newWard.id), {
        ...newWard,
        surveyCount: 0,
        isAvailableForPurchase: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast({ title: "Ward Added", description: `${newWard.name} has been created.` });
      setIsAddDialogOpen(false);
      setNewWard({ id: "", name: "", district: "", price: 5000 });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Wards & Booths</h1>
          <p className="text-sm text-slate-500 mt-1">Manage geographic targets and polling station data.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
              <Plus className="w-4 h-4 mr-2" />
              Add New Ward
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl border-none">
            <DialogHeader>
              <DialogTitle className="font-headline font-bold text-xl">Create New Ward</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Define a new geographic administrative unit.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ward ID (e.g. ward-85)</Label>
                <Input 
                  placeholder="Unique ID" 
                  value={newWard.id}
                  onChange={(e) => setNewWard({...newWard, id: e.target.value})}
                  className="rounded-xl bg-slate-50 border-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ward Name</Label>
                <Input 
                  placeholder="e.g. Indiranagar East" 
                  value={newWard.name}
                  onChange={(e) => setNewWard({...newWard, name: e.target.value})}
                  className="rounded-xl bg-slate-50 border-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">District</Label>
                <Input 
                  placeholder="e.g. Bengaluru Central" 
                  value={newWard.district}
                  onChange={(e) => setNewWard({...newWard, district: e.target.value})}
                  className="rounded-xl bg-slate-50 border-slate-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddWard} className="w-full bg-primary rounded-xl font-bold h-12 shadow-lg shadow-primary/10">
                Create Ward Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Wards", value: wards?.length || "0", icon: Map, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Booths", value: (wards?.length || 0) * 15, icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Active Surveyors", value: "0", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg. Coverage", value: "0%", icon: ChevronRight, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
            <CardContent className="p-4 md:p-5 flex flex-col gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search wards by name or district..." className="pl-10 bg-white border-slate-100 h-11 rounded-xl" />
        </div>
        <Button variant="outline" className="rounded-xl h-11 border-slate-100 bg-white font-bold text-slate-600">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {wards?.map((ward) => (
            <Card key={ward.id} className="border-none shadow-sm bg-white overflow-hidden rounded-2xl group hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="p-5 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-headline font-bold text-slate-900">{ward.name}</h3>
                      <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-slate-100">
                        {ward.district}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Ward ID: {ward.id}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-50">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 border-y border-slate-50 bg-slate-50/30">
                  <div className="p-4 text-center border-r border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Booths</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{ward.surveyCount > 0 ? (ward.surveyCount / 10).toFixed(0) : "0"}</p>
                  </div>
                  <div className="p-4 text-center border-r border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Coverage</p>
                    <p className="text-sm font-extrabold text-emerald-600 mt-1">{ward.surveyCount > 0 ? "85%" : "0%"}</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Surveys</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{ward.surveyCount}</p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary font-bold text-xs hover:bg-primary/5">
                    Manage Booths
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!wards || wards.length === 0) && !isLoading && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No wards found</p>
              <p className="text-slate-500 text-sm mt-2">Use the "Bootstrap" button in Settings to create initial data.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
