export type MainResponse<T> = {
  success: boolean;
  metadata: Metadata[];
  data: T & { accessToken: string };
}

export type MainResponseWithPagination<T> = {
  data: T[];
  success: boolean;
  metadata: Metadata;
}

export type Metadata = {
  messages: ErrorMessageResponse[];
  pagination: Pagination;
}

type ErrorMessageResponse = {
  errorCode: string;
  errorMessage: string;
  field: string;
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