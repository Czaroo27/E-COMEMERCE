"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, isInStock } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const inStock = isInStock(product);

  return (
    // ========== TailwindCSS: group class, hover pseudoclass, container query ==========
    <Card className="group @container overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Overlay visible on group hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/20 group-hover:opacity-100">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/products/${product.id}`}>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full bg-background text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Zobacz szczegoly</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Zobacz szczegoly</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {inStock && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full bg-background text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addItem(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">Dodaj do koszyka</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Dodaj do koszyka</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.featured && (
            <Badge className="bg-primary text-primary-foreground">Hit</Badge>
          )}
          {!inStock && (
            <Badge variant="destructive">Niedostepny</Badge>
          )}
        </div>
      </div>
      {/* ========== TailwindCSS: Container query usage ========== */}
      <CardContent className="p-4 @[20rem]:p-6">
        <div className="mb-1 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="mb-1 text-sm font-semibold text-foreground transition-colors hover:text-primary @[20rem]:text-base">
            {product.name}
          </h3>
        </Link>
        <p className="mb-3 hidden text-xs leading-relaxed text-muted-foreground @[20rem]:line-clamp-2 @[20rem]:block">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {inStock && (
            <Button
              size="sm"
              onClick={() => addItem(product)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
            >
              <ShoppingCart className="mr-1 h-3.5 w-3.5" />
              <span className="hidden @[20rem]:inline">Dodaj</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
