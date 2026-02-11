import { CartView } from "@/components/cart-view";

export const metadata = {
  title: "Koszyk - TechNova",
  description: "Twoj koszyk zakupow.",
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
          Zakupy
        </p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Twoj koszyk
        </h1>
      </div>
      <CartView />
    </div>
  );
}
