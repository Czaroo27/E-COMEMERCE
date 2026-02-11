"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CartView() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Koszyk jest pusty</h2>
        <p className="mb-6 text-muted-foreground">
          Dodaj produkty do koszyka, aby kontynuowac zakupy.
        </p>
        <Link href="/products">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Przegladaj produkty
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart items table */}
      <div className="lg:col-span-2">
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">
              Koszyk ({totalItems} {totalItems === 1 ? "produkt" : "produktow"})
            </CardTitle>
            {/* ========== Shadcn: AlertDialog ========== */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Wyczysc
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Wyczysc koszyk?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Czy na pewno chcesz usunac wszystkie produkty z koszyka?
                    Tej operacji nie mozna cofnac.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearCart}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Wyczysc koszyk
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent className="p-0">
            {/* ========== Shadcn: Table ========== */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Produkt</TableHead>
                  <TableHead>Nazwa</TableHead>
                  <TableHead className="text-center">Ilosc</TableHead>
                  <TableHead className="text-right">Cena</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.product.id}>
                    <TableCell>
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.product.price)} / szt.
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Zmniejsz ilosc</span>
                        </Button>
                        <span className="w-8 text-center font-mono text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Zwieksz ilosc</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Usun</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Usun z koszyka</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Order summary */}
      <div>
        <Card className="sticky top-24 border border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Podsumowanie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Produkty ({totalItems})</span>
                <span className="text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dostawa</span>
                <span className="text-foreground">
                  {totalPrice >= 500 ? "Gratis" : formatPrice(19.99)}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Razem</span>
                  <span className="font-mono text-lg font-bold text-foreground">
                    {formatPrice(totalPrice >= 500 ? totalPrice : totalPrice + 19.99)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/checkout" className="w-full">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-transform">
                Przejdz do zamowienia
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
