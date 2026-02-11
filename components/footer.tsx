import Link from "next/link";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="h-3.5 w-3.5" />
              </div>
              TechNova
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Premium tech gadgets for the modern lifestyle. Quality you can trust.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Sklep</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Wszystkie produkty
                </Link>
              </li>
              <li>
                <Link href="/products?category=audio" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Audio
                </Link>
              </li>
              <li>
                <Link href="/products?category=wearables" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Wearables
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Pomoc</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/checkout" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Zamowienie
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Koszyk
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Kontakt</h4>
            <ul className="flex flex-col gap-2">
              <li className="text-sm text-muted-foreground">kontakt@technova.pl</li>
              <li className="text-sm text-muted-foreground">+48 123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 TechNova. Wszelkie prawa zastrzezone.
          </p>
        </div>
      </div>
    </footer>
  );
}
