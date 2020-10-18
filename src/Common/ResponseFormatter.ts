import { GridFilterType } from './Enumerations';
import { OrderType } from './Types';
import { HttpStatus } from '@nestjs/common';

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

export class OkResponse {
  statusCode: HttpStatus;
  message: string | boolean | number;
}

export function Ok(message: string | boolean | number, statusCode: HttpStatus = 200) {
  return {
    statusCode: statusCode,
    message: message,
  };
}
