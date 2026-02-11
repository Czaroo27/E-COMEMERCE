import { CheckoutForm } from "@/components/checkout-form";

export const metadata = {
  title: "Zamowienie - TechNova",
  description: "Sfinalizuj swoje zamowienie.",
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
          Finalizacja
        </p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Zamowienie
        </h1>
      </div>
      <CheckoutForm />
    </div>
  );
}
