import UsersView from "@/app/(pages)/users/view";
import initApiService from "@/app/services/api/apiService";
import { MainResponseWithPagination } from "@/shared/types/response/dto";
import { User } from "@/shared/types/response/user";
import { URI_PATH } from "@/shared/constants/path";

export default async function UsersPage() {
  const apiService = await initApiService();
  const emptyData: MainResponseWithPagination<User> = {} as MainResponseWithPagination<User>;

  async function fetchInitialData() {
    try {
      const response = await apiService.list<MainResponseWithPagination<User>>(URI_PATH.API.USERS, {
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

  const data = await fetchInitialData();
  return <UsersView initialData={data}/>;
}
