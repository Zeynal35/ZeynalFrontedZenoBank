export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
};

export type PaginatedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};
