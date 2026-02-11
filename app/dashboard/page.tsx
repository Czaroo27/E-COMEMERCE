import { DashboardView } from "@/components/dashboard-view";

export const metadata = {
  title: "Dashboard - TechNova",
  description: "Statystyki sprzedazy i analityka sklepu.",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
          Analityka
        </p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Dashboard
        </h1>
      </div>
      <DashboardView />
    </div>
  );
}
