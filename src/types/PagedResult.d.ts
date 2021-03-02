interface PagedResult<T> {
  content: Array<T>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}