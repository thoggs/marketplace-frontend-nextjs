import UsersView from "@/app/(pages)/users/view";
import initApiService from "@/app/services/api/apiService";
import { MainResponseWithPagination } from "@/shared/types/response/dto";
import { User } from "@/shared/types/response/user";
import { URI_PATH } from "@/shared/constants/path";

export default async function UsersPage() {
  const apiService = await initApiService();

  async function getUsers() {
    try {
      const response = await apiService.list<MainResponseWithPagination<User>>(URI_PATH.API.USERS, {
        pageSize: 50,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const users = await getUsers();
  return <UsersView initialUsers={users}/>;
}
