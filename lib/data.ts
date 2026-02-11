import type { Product, SalesData } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "Nova Pro Headphones",
    description:
      "Premium wireless headphones with active noise cancellation, 40-hour battery life, and studio-quality sound. Features adaptive EQ technology that automatically tunes music to your ears.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    category: "audio",
    price: 1299,
    currency: "PLN",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    featured: true,
    specs: {
      "Driver Size": "40mm",
      "Battery Life": "40 hours",
      Connectivity: "Bluetooth 5.3",
      Weight: "250g",
    },
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Pulse Smart Watch",
    description:
      "Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration. Track your fitness goals with precision sensors and a vibrant AMOLED display.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    category: "wearables",
    price: 1899,
    currency: "PLN",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    featured: true,
    specs: {
      Display: "1.4 inch AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "5ATM",
      Sensors: "Heart rate, SpO2, GPS",
    },
    createdAt: "2025-02-10",
  },
  {
    id: "3",
    name: "AirBuds Ultra",
    description:
      "True wireless earbuds delivering immersive spatial audio with dynamic head tracking. Crystal-clear calls with advanced beamforming microphones.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=600&fit=crop",
    category: "audio",
    price: 899,
    currency: "PLN",
    rating: 4.7,
    reviews: 312,
    inStock: true,
    featured: false,
    specs: {
      "Driver Size": "11mm",
      "Battery Life": "8h + 32h case",
      ANC: "Adaptive",
      Connectivity: "Bluetooth 5.3",
    },
    createdAt: "2025-03-05",
  },
  {
    id: "4",
    name: "TechBand Fitness",
    description:
      "Lightweight fitness tracker with continuous heart rate monitoring, sleep tracking, and 14-day battery life. Water resistant and perfect for all-day wear.",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=600&fit=crop",
    category: "wearables",
    price: 349,
    currency: "PLN",
    rating: 4.3,
    reviews: 156,
    inStock: true,
    featured: false,
    specs: {
      Display: "0.96 inch OLED",
      "Battery Life": "14 days",
      "Water Resistance": "IP68",
      Sensors: "Heart rate, Accelerometer",
    },
    createdAt: "2025-01-20",
  },
  {
    id: "5",
    name: "ChargePad Wireless",
    description:
      "Fast wireless charging pad supporting up to 15W Qi charging. Sleek aluminum design with LED indicator and foreign object detection for safe charging.",
    image: "https://images.unsplash.com/photo-1618577608401-46f4a95be6c0?w=600&h=600&fit=crop",
    category: "accessories",
    price: 199,
    currency: "PLN",
    rating: 4.5,
    reviews: 98,
    inStock: true,
    featured: false,
    specs: {
      "Max Power": "15W",
      Compatibility: "Qi-enabled devices",
      Material: "Aluminum + Silicone",
      "Cable Length": "1.5m USB-C",
    },
    createdAt: "2025-04-01",
  },
  {
    id: "6",
    name: "Echo Sphere Speaker",
    description:
      "360-degree smart speaker with rich, room-filling sound and built-in voice assistant. Multi-room audio support and customizable equalizer settings.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    category: "smart-home",
    price: 699,
    currency: "PLN",
    rating: 4.4,
    reviews: 210,
    inStock: true,
    featured: true,
    specs: {
      "Speaker Type": "360-degree",
      Power: "30W",
      Connectivity: "Wi-Fi, Bluetooth 5.0",
      "Voice Assistant": "Built-in",
    },
    createdAt: "2025-02-28",
  },
  {
    id: "7",
    name: "ProCase Leather",
    description:
      "Premium genuine leather phone case with MagSafe compatibility. Handcrafted with full-grain leather that develops a unique patina over time.",
    image: "https://images.unsplash.com/photo-1541877944-ac82a091518a?w=600&h=600&fit=crop",
    category: "accessories",
    price: 249,
    currency: "PLN",
    rating: 4.6,
    reviews: 87,
    inStock: false,
    featured: false,
    specs: {
      Material: "Full-grain leather",
      Compatibility: "MagSafe",
      Protection: "Drop-tested 2m",
      Colors: "Black, Brown, Tan",
    },
    createdAt: "2025-03-15",
  },
  {
    id: "8",
    name: "LumiHub Smart Light",
    description:
      "Smart LED light hub with 16 million colors, voice control, and scene automation. Create the perfect ambiance for any room with programmable lighting schedules.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop",
    category: "smart-home",
    price: 449,
    currency: "PLN",
    rating: 4.2,
    reviews: 143,
    inStock: true,
    featured: false,
    specs: {
      Colors: "16 million",
      Protocol: "Wi-Fi, Zigbee",
      Brightness: "800 lumens",
      "Energy Rating": "A++",
    },
    createdAt: "2025-04-10",
  },
];

export const salesData: SalesData[] = [
  { month: "Sty", revenue: 42000, orders: 120 },
  { month: "Lut", revenue: 38000, orders: 105 },
  { month: "Mar", revenue: 51000, orders: 145 },
  { month: "Kwi", revenue: 47000, orders: 132 },
  { month: "Maj", revenue: 59000, orders: 168 },
  { month: "Cze", revenue: 63000, orders: 180 },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
