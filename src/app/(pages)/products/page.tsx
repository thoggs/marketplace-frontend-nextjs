import ProductsView from "@/app/(pages)/products/view";
import initApiService from "@/app/services/api/apiService";
import { MainResponseWithPagination } from "@/shared/types/response/dto";
import { Product } from "@/shared/types/response/product";
import { URI_PATH } from "@/shared/constants/path";

export default async function ProductsPage() {
  const apiService = await initApiService();
  const emptyData: MainResponseWithPagination<Product> = {} as MainResponseWithPagination<Product>;

  async function fetchProducts() {
    try {
      const response = await apiService.list<MainResponseWithPagination<Product>>(URI_PATH.API.PRODUCTS, {
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
  return <ProductsView initialData={data}/>
}