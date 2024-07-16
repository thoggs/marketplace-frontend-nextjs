import { User } from "@/shared/types/response/user";
import { MainResponseWithPagination } from "@/shared/types/response/dto";

export type UsersViewProps = {
  initialData: MainResponseWithPagination<User>;
}