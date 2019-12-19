import * as React from 'react';
import { CommonListResponse } from '@/utils/request';
export interface ICommonTableProps {
  api: {
    url: string;
    method?: string;
    data?: any;
    headers?: any;
  };
  changeReload?: boolean;
  columns: any;
  className?: 'string';
  bodyStyle?: any;
  autoload?: boolean;
  scroll?: { x?: boolean | number; y?: boolean | number };
  autoRowSelection?: {
    auto: boolean;
    onSelectChange?: (total: number, selectedRowKeys: any, unSelectedRowKeys?: any) => void;
    [x: string]: any;
  };
  onRefresh?: (res: CommonListResponse) => void;

  [x: string]: any;
}

export default class CommonTable extends React.Component<ICommonTableProps, any> {
  reload: Function;
  reloadCurrentPage: (data?: any[] | { [key: string]: any }) => Promise<any>;
}
