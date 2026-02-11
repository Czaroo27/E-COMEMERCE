"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { ShoppingCart, Star, ArrowLeft, Check, Info } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, isInStock } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ProductCard } from "@/components/product-card";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  // ========== TypeScript: Ref typing for states/refs ==========
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inStock = isInStock(product);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAdded(false), 2000);
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Powrot do produktow
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image */}
        <div className="group relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-primary text-primary-foreground">Hit</Badge>
            )}
            {!inStock && <Badge variant="destructive">Niedostepny</Badge>}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            {product.category}
          </p>
          <h1 className="mb-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews} opinii)
            </span>
          </div>

          <p className="mb-6 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mb-6 font-mono text-3xl font-bold text-foreground">
            {formatPrice(product.price)}
          </div>

          {/* Actions */}
          <div className="mb-8 flex flex-wrap gap-3">
            {inStock ? (
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-transform"
              >
                {added ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Dodano do koszyka
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Dodaj do koszyka
                  </>
                )}
              </Button>
            ) : (
              <Button size="lg" disabled>
                Niedostepny
              </Button>
            )}

            {/* ========== Shadcn: Dialog usage ========== */}
            <Dialog>
              <DialogTrigger asChild>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="lg" variant="outline" className="bg-transparent">
                        <Info className="mr-2 h-4 w-4" />
                        Specyfikacja
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Pokaz pelna specyfikacje</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Specyfikacja - {product.name}</DialogTitle>
                  <DialogDescription>
                    Szczegolowa specyfikacja techniczna produktu.
                  </DialogDescription>
                </DialogHeader>
                {/* ========== Shadcn: Table usage ========== */}
                <Table>
                  <TableBody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium text-foreground">
                          {key}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick specs */}
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Kluczowe cechy
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(product.specs)
                .slice(0, 4)
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-muted-foreground">{key}</p>
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            Podobne produkty
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
