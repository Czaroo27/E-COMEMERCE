"use client";

// ========== Shadcn: Custom Compound Components pattern ==========
import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type StepperContextType = {
  currentStep: number;
  totalSteps: number;
};

const StepperContext = createContext<StepperContextType>({
  currentStep: 0,
  totalSteps: 0,
});

function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("Stepper components must be used within <Stepper>");
  return ctx;
}

// ========== Root ==========
function Stepper({
  currentStep,
  children,
  className,
}: {
  currentStep: number;
  children: React.ReactNode;
  className?: string;
}) {
  const totalSteps = React.Children.count(children);

  return (
    <StepperContext.Provider value={{ currentStep, totalSteps }}>
      <div className={cn("flex items-center gap-0", className)}>
        {React.Children.map(children, (child, index) => (
          <>
            {child}
            {index < totalSteps - 1 && <StepperSeparator index={index} />}
          </>
        ))}
      </div>
    </StepperContext.Provider>
  );
}

// ========== Step ==========
function StepperStep({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description?: string;
}) {
  const { currentStep } = useStepper();
  const isCompleted = index < currentStep;
  const isCurrent = index === currentStep;

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
          isCompleted && "border-primary bg-primary text-primary-foreground",
          isCurrent && "border-primary bg-background text-primary",
          !isCompleted && !isCurrent && "border-border bg-background text-muted-foreground"
        )}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
      </div>
      <div className="hidden sm:block">
        <p
          className={cn(
            "text-sm font-medium leading-none",
            isCurrent ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {title}
        </p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

// ========== Separator ==========
function StepperSeparator({ index }: { index: number }) {
  const { currentStep } = useStepper();
  const isCompleted = index < currentStep;

  return (
    <div
      className={cn(
        "mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300",
        isCompleted ? "bg-primary" : "bg-border"
      )}
    />
  );
}

// Compound exports
Stepper.Step = StepperStep;

export { Stepper, StepperStep, StepperSeparator };
