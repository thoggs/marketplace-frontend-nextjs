import ProductsView from "@/app/(pages)/products/view";
import initApiService from "@/app/services/api/apiService";
import { MainResponseWithPagination } from "@/shared/types/response/dto";
import { URI_PATH } from "@/shared/constants/path";
import { Product } from "@/shared/types/response/product";

export default async function ProductsPage() {
  const apiService = await initApiService();

  async function fetchProducts() {
    try {
      const response = await apiService.list<MainResponseWithPagination<Product>>(URI_PATH.API.PRODUCTS, {
        pageSize: 50,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const products = await fetchProducts();
  return <ProductsView initialProducts={products}/>
}