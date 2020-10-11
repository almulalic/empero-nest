export enum GridFilterType {
  Range = 1,
  Match = 2,
  Contains = 3,
}
export type GridFilterValue = 'string' | 'number' | 'boolean' | 'date' | 'null';

export type OrderType = 'ASC' | 'DESC';

export class GridDataFilter {
  type: GridFilterType;
  key: string;
  value: OrderType;
}

export class GridParams {
  page: number;
  itemsPerPage: number;
  sortBy?: string = 'createdAt';
  order: OrderType = 'ASC';
  filters: GridDataFilter[];

  constructor(page: number, itemsPerPage: number, sortBy: string, order: OrderType) {
    this.page = page;
    this.itemsPerPage = itemsPerPage;
    this.sortBy = sortBy;
    this.order = order;
  }
}

export class ResponseGrid<T> {
  private readonly total: number;
  private readonly records: T[];

  constructor(records: T[]) {
    this.total = records.length;
    this.records = records;
  }

  public GetGridData(gridParams: GridParams) {
    if (this.records.length === 0) return new ResponseGrid<T>(this.records);

    let filtered: T[] = this.records;

    gridParams.filters.forEach((filter) => {
      switch (filter.type) {
        case GridFilterType.Match:
          filtered = this.records.filter((record) => record[filter.key] == filter.value);
          break;
        case GridFilterType.Range:
          filtered = this.records.filter(
            (record) => record[filter.key] >= filter.value[0] && record[filter.key] <= filter.value[1],
          );
          break;
        case GridFilterType.Contains:
          filtered = this.records.filter((record) => record[filter.key].includes(filter.value));
          break;
      }
    });

    return new ResponseGrid<T>(filtered);
  }
}
