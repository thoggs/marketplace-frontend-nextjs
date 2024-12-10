import ProductsView from "@/app/(pages)/products/view";
import initApiService from "@/app/services/api/apiService";
import { MainResponseWithPagination } from "@/shared/types/response/dto";
import { Product } from "@/shared/types/response/product";
import { API } from "@/shared/constants/path";

export default async function ProductsPage() {
  const serverUri = API.SERVER.ENDPOINTS.PRODUCTS;
  const clientUri = API.CLIENT.ENDPOINTS.PRODUCTS;
  const apiService = await initApiService();
  const emptyData: MainResponseWithPagination<Product> = {} as MainResponseWithPagination<Product>;

  async function fetchProducts() {
    try {
      const response = await apiService.list<MainResponseWithPagination<Product>>(serverUri, {
        pageSize: 50,
      });
      if (response && response.data && response.data.length > 0) {
        return response;
      }
      return emptyData;
    } catch (error) {
      console.error(error);
      return emptyData;
    }
  }

  const data = await fetchProducts();
  return <ProductsView clientUri={clientUri} initialData={data}/>
}