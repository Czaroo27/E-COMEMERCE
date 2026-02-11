import { ProductsGrid } from "@/components/products-grid";

export const metadata = {
  title: "Produkty - TechNova",
  description: "Przegladaj nasza kolekcje premium gadzeetow technologicznych.",
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
          Kolekcja
        </p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Wszystkie produkty
        </h1>
      </div>
      <ProductsGrid />
    </div>
  );
}
