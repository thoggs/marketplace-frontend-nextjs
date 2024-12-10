import { Product } from "@/shared/types/response/product";

export type DashboardViewProps = {
  clientUri: string;
  initialProducts: Product[];
}

export type StockByCategory = {
  category: string;
  stock: number;
}

export type PriceByCategory = {
  category: string;
  totalPrice: number;
}