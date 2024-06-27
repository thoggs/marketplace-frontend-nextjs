export type MainResponse<T> = {
  success: boolean;
  metadata: any;
  data: T;
}

export type MainResponseWithPagination<T> = {
  data: T[];
  success: boolean;
  metadata: any;
  pagination: Pagination;
}

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  }
}

export type ErrorResponse<T> = {
  message: T;
}

export type ErrorResponseMessage = {
  firstName: string[];
  lastName: string[];
  email: string[];
  age: string[];
  birthDate: string[];
  hobby: string[];
};