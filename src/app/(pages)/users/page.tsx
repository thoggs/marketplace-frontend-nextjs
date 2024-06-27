import UsersView from "@/app/(pages)/users/view";
import initApiService from "@/app/services/api/apiService";
import { URI_PATH } from "@/shared/constants/path";
import { User } from "@/shared/types/response/user";
import { MainResponseWithPagination } from "@/shared/types/response/dto";

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
