import DashboardView from "@/app/(pages)/dashboard/view";
import initApiService from "@/app/services/api/apiService";
import { MainResponseWithPagination } from "@/shared/types/response/dto";
import { Product } from "@/shared/types/response/product";
import { API } from "@/shared/constants/path";

export default async function DashboardPage() {
  const serverUri = API.SERVER.ENDPOINTS.PRODUCTS;
  const clientUri = API.CLIENT.ENDPOINTS.PRODUCTS;
  const apiService = await initApiService();

  async function fetchProducts() {
    try {
      const response = await apiService.list<MainResponseWithPagination<Product>>(serverUri, {
        pageSize: 100 * 1000,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const products = await fetchProducts();
  return <DashboardView clientUri={clientUri} initialProducts={products}/>
}