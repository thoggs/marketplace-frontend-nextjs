import DashboardView from "@/app/(pages)/dashboard/view";
import initApiService from "@/app/services/api/apiService";
import { MainResponseWithPagination } from "@/shared/types/response/dto";
import { Product } from "@/shared/types/response/product";
import { URI_PATH } from "@/shared/constants/path";

export default async function DashboardPage() {
  const apiService = await initApiService();

  async function fetchProducts() {
    try {
      const response = await apiService.list<MainResponseWithPagination<Product>>(URI_PATH.API.PRODUCTS, {
        pageSize: 100 * 1000,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const products = await fetchProducts();
  return <DashboardView initialProducts={products}/>
}