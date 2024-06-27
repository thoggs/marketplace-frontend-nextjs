export type ApiService = {
  list<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
  show<T>(endpoint: string, id: string | number): Promise<T>;
  create<T>(endpoint: string, data: any): Promise<T>;
  update<T>(endpoint: string, id: string | number, data: any): Promise<T>;
  destroy<T>(endpoint: string, id: string | number): Promise<T>;
}
