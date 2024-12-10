import { User } from "@/shared/types/response/user";
import { MainResponseWithPagination } from "@/shared/types/response/dto";

export type UsersViewProps = {
  clientUri: string;
  initialData: MainResponseWithPagination<User>;
}