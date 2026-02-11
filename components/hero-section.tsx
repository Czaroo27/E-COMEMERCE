"use client";

import Link from "next/link";
import { ArrowRight, Headphones, Watch, Speaker } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    // ========== TailwindCSS: media query (responsive), custom animation ==========
    <section className="relative overflow-hidden bg-foreground text-background">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary animate-pulse-ring" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary/60" />
      </div>

      <div className="container relative mx-auto px-4 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary animate-fade-in-up">
            Premium Tech Gadgets
          </p>
          <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Technologia nowej generacji
          </h1>
          <p className="mb-8 text-pretty text-lg leading-relaxed text-background/70 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Odkryj nasz starannie wyselekcjonowany zbior najnowszych gadzeetow technologicznych.
            Polaczenie innowacyjnego designu z najwyzsza jakoscia.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-transform"
              >
                Przeglądaj produkty
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-background/30 bg-transparent text-background hover:bg-background/10 active:scale-95 transition-transform"
              >
                Zobacz statystyki
              </Button>
            </Link>
          </div>
        </div>

        {/* Category cards */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 sm:gap-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {[
            { icon: Headphones, label: "Audio", count: 3 },
            { icon: Watch, label: "Wearables", count: 2 },
            { icon: Speaker, label: "Smart Home", count: 2 },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={`/products?category=${cat.label.toLowerCase().replace(" ", "-")}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-background/10 bg-background/5 p-4 transition-all duration-300 hover:bg-background/10 hover:border-primary/30 sm:p-6"
            >
              <cat.icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110 sm:h-8 sm:w-8" />
              <span className="text-xs font-semibold sm:text-sm">{cat.label}</span>
              <span className="text-[10px] text-background/60 sm:text-xs">{cat.count} produkty</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
