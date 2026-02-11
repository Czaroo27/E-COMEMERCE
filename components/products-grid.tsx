"use client";

import { useState } from "react";
import { products } from "@/lib/data";
import type { Product, ProductCategory } from "@/lib/types";
import { isProduct } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { GenericList } from "@/components/generic-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Wszystkie" },
  { value: "audio", label: "Audio" },
  { value: "wearables", label: "Wearables" },
  { value: "accessories", label: "Akcesoria" },
  { value: "smart-home", label: "Smart Home" },
];

export function ProductsGrid() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => {
        // ========== TypeScript: Type predicate in action ==========
        if (!isProduct(p)) return false;
        return p.category === activeCategory;
      });

  return (
    <div>
      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={activeCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "transition-all",
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground"
                : "bg-transparent hover:bg-secondary"
            )}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* ========== TypeScript: Generic component in use ========== */}
      <GenericList<Product>
        items={filtered}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <ProductCard product={item} />}
        emptyMessage="Brak produktow w tej kategorii"
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      />
    </div>
  );
}
