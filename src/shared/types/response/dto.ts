export type MainResponse<T> = {
  success: boolean;
  metadata: any;
  data: T;
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