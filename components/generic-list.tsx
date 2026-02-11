"use client";

import React from "react"

// ========== TypeScript: Generic Component* ==========
import { cn } from "@/lib/utils";

type GenericListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
  itemClassName?: string;
};

export function GenericList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "Brak elementow do wyswietlenia",
  className,
  itemClassName,
}: GenericListProps<T>) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", className)}>
      {items.map((item, index) => (
        <div key={keyExtractor(item)} className={cn(itemClassName)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
