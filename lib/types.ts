// ========== TypeScript: Union types ==========
export type ProductCategory = "audio" | "wearables" | "accessories" | "smart-home";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

// ========== TypeScript: Intersection types ==========
type BaseEntity = {
  id: string;
  createdAt: string;
};

type Priceable = {
  price: number;
  currency: string;
};

export type Product = BaseEntity &
  Priceable & {
    name: string;
    description: string;
    image: string;
    category: ProductCategory;
    rating: number;
    reviews: number;
    inStock: boolean;
    featured: boolean;
    specs: Record<string, string>; // TS: Record generic
  };

export type CartItem = {
  product: Product;
  quantity: number;
};

// ========== TypeScript: Pick, Omit generics ==========
export type ProductSummary = Pick<Product, "id" | "name" | "price" | "image" | "currency">;

export type ProductFormData = Omit<Product, "id" | "createdAt">;

// ========== TypeScript: Partial generic ==========
export type ProductUpdate = Partial<Product>;

// ========== TypeScript: Readonly generic ==========
export type ReadonlyProduct = Readonly<Product>;

// ========== TypeScript: Exclude generic ==========
export type NonAudioCategory = Exclude<ProductCategory, "audio">;

// ========== TypeScript: Function overloads ==========
export function formatPrice(amount: number): string;
export function formatPrice(amount: number, currency: string): string;
export function formatPrice(amount: number, currency?: string): string {
  const cur = currency ?? "PLN";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: cur,
  }).format(amount);
}

// ========== TypeScript: Type predicate ==========
export function isProduct(item: unknown): item is Product {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "name" in item &&
    "price" in item &&
    "category" in item
  );
}

export function isInStock(product: Pick<Product, "inStock">): product is Pick<Product, "inStock"> & { inStock: true } {
  return product.inStock === true;
}

// ========== Sales data for charts ==========
export type SalesData = {
  month: string;
  revenue: number;
  orders: number;
};

export type CheckoutFormData = {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Step 2: Address
  street: string;
  city: string;
  postalCode: string;
  country: string;
  // Step 3: Payment
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
};
