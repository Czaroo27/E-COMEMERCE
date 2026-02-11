"use client";

import React from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
} from "lucide-react";
import { salesData, products } from "@/lib/data";
import type { Product, ProductCategory, SalesData } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ========== TypeScript: Readonly built-in generic ==========
const chartConfig: Readonly<ChartConfig> = {
  revenue: {
    label: "Przychod",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Zamowienia",
    color: "hsl(var(--chart-2))",
  },
};

// ========== TypeScript: Required built-in generic ==========
type RequiredSalesData = Required<SalesData>;

// ========== TypeScript: Partial generic in use ==========
function mergeSalesData(
  base: SalesData,
  update: Partial<SalesData>,
): RequiredSalesData {
  return { ...base, ...update } as RequiredSalesData;
}

// ========== TypeScript: Promise generic ==========
async function fetchDashboardStats(): Promise<{
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalProducts: number;
}> {
  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  return {
    totalRevenue,
    totalOrders,
    avgOrderValue: totalRevenue / totalOrders,
    totalProducts: products.length,
  };
}

// ========== TypeScript: Function overloads ==========
function formatValue(value: number): string;
function formatValue(value: string): string;
function formatValue(value: number | string): string {
  if (typeof value === "number") {
    return `$${value.toFixed(2)}`;
  }
  return value.toUpperCase();
}

// ========== TypeScript: Type predicate ==========
function isSalesData(obj: any): obj is SalesData {
  return (
    obj &&
    typeof obj.month === "string" &&
    typeof obj.revenue === "number" &&
    typeof obj.orders === "number"
  );
}

// Category distribution data
const categoryData: { category: string; count: number }[] = (
  ["audio", "wearables", "accessories", "smart-home"] as ProductCategory[]
).map((cat) => ({
  category: cat,
  count: products.filter((p) => p.category === cat).length,
}));

const categoryChartConfig: ChartConfig = {
  count: {
    label: "Produkty",
    color: "hsl(var(--chart-3))",
  },
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card className='border border-border'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-foreground'>{value}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardView() {
  const stats = {
    totalRevenue: salesData.reduce((sum, d) => sum + d.revenue, 0),
    totalOrders: salesData.reduce((sum, d) => sum + d.orders, 0),
    avgOrderValue: 0,
    totalProducts: products.length,
  };
  stats.avgOrderValue = stats.totalRevenue / stats.totalOrders;

  // ========== TypeScript: Using type predicate ==========
  const firstData = salesData[0];
  if (isSalesData(firstData)) {
    console.log("First data is valid SalesData:", firstData);
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Stats cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title={formatValue("Przychod")}
          value={formatPrice(stats.totalRevenue)}
          description='+12.5% od poprzedniego miesiaca'
          icon={DollarSign}
        />
        <StatCard
          title='Zamowienia'
          value={stats.totalOrders.toString()}
          description='+8.2% od poprzedniego miesiaca'
          icon={ShoppingCart}
        />
        <StatCard
          title='Srednia wartosc'
          value={formatPrice(stats.avgOrderValue)}
          description='Na zamowienie'
          icon={TrendingUp}
        />
        <StatCard
          title='Produkty'
          value={stats.totalProducts.toString()}
          description={`${products.filter((p) => p.inStock).length} dostepnych`}
          icon={Package}
        />
      </div>

      {/* Charts grid */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* ========== Shadcn: Area Chart ========== */}
        <Card className='border border-border'>
          <CardHeader>
            <CardTitle className='text-foreground'>
              Przychod miesieczny
            </CardTitle>
            <CardDescription>
              Przychod ze sprzedazy w ostatnich 6 miesiacach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className='h-[300px] w-full'>
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id='fillRevenue' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset='5%'
                      stopColor='var(--color-revenue)'
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='95%'
                      stopColor='var(--color-revenue)'
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray='3 3'
                  className='stroke-border'
                />
                <XAxis dataKey='month' className='text-xs' />
                <YAxis className='text-xs' />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type='monotone'
                  dataKey='revenue'
                  stroke='var(--color-revenue)'
                  fill='url(#fillRevenue)'
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar chart for orders */}
        <Card className='border border-border'>
          <CardHeader>
            <CardTitle className='text-foreground'>
              Zamowienia miesieczne
            </CardTitle>
            <CardDescription>
              Liczba zamowien w ostatnich 6 miesiacach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className='h-[300px] w-full'>
              <BarChart
                data={salesData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  className='stroke-border'
                />
                <XAxis dataKey='month' className='text-xs' />
                <YAxis className='text-xs' />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey='orders'
                  fill='var(--color-orders)'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Products table with Popover */}
      <Card className='border border-border'>
        <CardHeader>
          <CardTitle className='text-foreground'>Wszystkie produkty</CardTitle>
          <CardDescription>
            Lista produktow w sklepie z szczegolami
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nazwa</TableHead>
                <TableHead>Kategoria</TableHead>
                <TableHead className='text-center'>Ocena</TableHead>
                <TableHead className='text-center'>Opinie</TableHead>
                <TableHead className='text-right'>Cena</TableHead>
                <TableHead className='text-center'>Status</TableHead>
                <TableHead className='w-[50px]' />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className='font-medium text-foreground'>
                    {product.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary'>{product.category}</Badge>
                  </TableCell>
                  <TableCell className='text-center'>
                    {product.rating}
                  </TableCell>
                  <TableCell className='text-center'>
                    {product.reviews}
                  </TableCell>
                  <TableCell className='text-right font-mono'>
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell className='text-center'>
                    {product.inStock ? (
                      <Badge className='bg-primary/10 text-primary hover:bg-primary/20'>
                        Dostepny
                      </Badge>
                    ) : (
                      <Badge variant='destructive'>Niedostepny</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {/* ========== Shadcn: Popover ========== */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          Info
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-72'>
                        <div className='flex flex-col gap-2'>
                          <h4 className='font-semibold text-foreground'>
                            {product.name}
                          </h4>
                          <p className='text-sm text-muted-foreground'>
                            {product.description}
                          </p>
                          <div className='mt-2 grid grid-cols-2 gap-2'>
                            {Object.entries(product.specs)
                              .slice(0, 4)
                              .map(([key, value]) => (
                                <div key={key}>
                                  <p className='text-xs text-muted-foreground'>
                                    {key}
                                  </p>
                                  <p className='text-xs font-medium text-foreground'>
                                    {value}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
