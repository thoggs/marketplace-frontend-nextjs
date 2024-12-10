import { Product } from "@/shared/types/response/product";
import { MainResponseWithPagination } from "@/shared/types/response/dto";

export type ProductsViewProps = {
  clientUri: string;
  initialData: MainResponseWithPagination<Product>;
}