"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Progress } from "./ui/progress";
import {  Heart, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { Badge } from "./ui/badge";

export function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);

  const [selectedInterest, setSelectedInterest] = useState([]);

  const [location, setLocation] = useState({
    state: "",
    city: "",
    country: "India",
  });

  const progress = (step / 2) * 100;

  const toggleInterest = (categoryId) => {
    // Logic to toggle interest selection

    setSelectedInterest((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-4">
            <Progress className="h-1" value={progress} />
          </div>

          <DialogTitle className="flex items-center gap-2 text-2xl">
            {step === 1 ? (
              <>
                <Heart className="w-6 h-6 text-purple-500" />
                What interest you?
              </>
            ) : (
              <>
                <MapPin className="w-6 h-6 text-purple-500" />
                Where are you located?
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select atleast 3 categories to personalize your experience"
              : "We'll show you events happening near you"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid gridco2 sm:grid-cols-3 gap-3 max-h-100 overflow-y-auto p-2 ">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedInterest.includes(category.id)
                        ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20 "
                        : "border-border hover:border-purple-300"
                    } `}
                    onClick={() => toggleInterest(category.id)}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedInterest.length >= 3 ? "default" : "secondary"
                  }
                >
                  {selectedInterest.length} selected
                </Badge>
                {selectedInterest.length >= 3 && (
                  <span className="text-sm text-green-500">
                    ✓ Ready to continue
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
         
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
