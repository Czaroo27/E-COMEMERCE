"use client";

import { getFeaturedProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="container mx-auto px-4 py-16 lg:px-8 lg:py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Wyrozniamy
          </p>
          <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Popularne produkty
          </h2>
        </div>
        <Link href="/products">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Zobacz wszystkie
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
