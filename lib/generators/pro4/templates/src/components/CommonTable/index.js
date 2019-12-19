/*
 * @Author: yi.feng01
 * @Date: 2018-09-17 12:38:02
 * @Last Modified by: yi.feng01
 * @Last Modified time: 2019-09-02 00:19:28
 */
import React from 'react';
import { Table, Alert } from 'antd';
import _ from 'lodash';
import classNames from 'classnames';
import request, { RESPONSECODE } from '@/utils/request';
import Ellipsis from '@/components/Ellipsis';
import style from './style.less';

/* eslint-disable */
export default class CommonTable extends React.PureComponent {
  static defaultProps = {
    autoIndex: false,
    changeReload: true,
    autoRowSelection: {
      auto: false,
      selectAll: false,
    },
  };

  constructor(props) {
    super(props);
    this.enmu = {
      rowId: 'id',
      tableNo: 'commom_table_no',
      ...this.props.enmu,
    };
    const { autoload = true } = this.props;

    this.state = {
      loading: autoload,
      apiOtherData: undefined,
      data: [],
      selectedRowKeys: [],
      unSelectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 50,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '30', '50', '100'],
      },
    };
  }

  componentDidMount() {
    const { autoload = true } = this.props;
    autoload && this.loadData();
  }

  clear = cb => {
    const initFn = () => {};
    this.setState(
      {
        selectedRowKeys: [],
        unSelectedRowKeys: [],
      },
      cb || initFn,
    );
  };

  reset = cb => {
    const initFn = () => {};
    this.setState(
      {
        selectedRowKeys: [],
        unSelectedRowKeys: [],
        pagination: {
          current: 1,
          pageSize: 50,
          total: 0,
          showSizeChanger: true,
          showQuickJumper: true,
        },
      },
      cb || initFn,
    );
  };

  //处理checkbox 改变后回调
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedRowKeys, pagination, unSelectedRowKeys } = this.state;
    const { autoRowSelection } = this.props;
    let total = selectedRowKeys.length;
    if (autoRowSelection.selectAll) {
      total = pagination.total - unSelectedRowKeys.length;
    }
    if (this.state.total !== total) {
      this.setState(
        {
          total,
        },
        this.onSelectChangeCallback,
      );
    }

    //全选状态
    if (!prevProps.autoRowSelection.selectAll && this.props.autoRowSelection.selectAll) {
      const { data = [] } = this.state;
      const currentKeys = data.map(item => this.getRowKey(item));
      this.setState(
        {
          selectedRowKeys: [...currentKeys],
        },
        this.onSelectChangeCallback,
      );
    }

    //非全选状态
    if (prevProps.autoRowSelection.selectAll && !this.props.autoRowSelection.selectAll) {
      this.setState(
        {
          selectedRowKeys: [],
          unSelectedRowKeys: [],
        },
        this.onSelectChangeCallback,
      );
    }

    if (!this.props.changeReload) {
      return;
    }
    if (
      this.props.api.url !== prevProps.api.url ||
      JSON.stringify(this.props.api.data) !== JSON.stringify(prevProps.api.data)
    ) {
      //todo reload不会充值pagination
      this.reload(this.props.api.data);
    }
  }

  reload = (data, cb) => {
    if (data && Array.isArray(data)) {
      this.setState({
        data,
      });
      return;
    }

    if (data && Object.prototype.toString.call(data) === '[object Object]') {
      this.setState({
        apiOtherData: data,
      });
    }

    this.reset();
    return new Promise(resolve => {
      setTimeout(() => this.loadData({ callback: resolve }), 0);
    });
  };

  reloadCurrentPage = (data, cb) => {
    if (data && Array.isArray(data)) {
      this.setState({
        data,
      });
      return;
    }

    if (data && Object.prototype.toString.call(data) === '[object Object]') {
      this.setState({
        apiOtherData: data,
      });
    }

    this.clear();
    return new Promise(resolve => {
      setTimeout(() => this.loadData({ callback: resolve }), 0);
    });
  };

  getRowKey = item => {
    const rowkey = this.props.rowKey;
    if (rowkey && typeof rowkey == 'function') {
      return rowkey(item);
    }
    return item[rowkey || this.enmu.rowId];
  };

  resetPagination = (page = 1, pageSize = 50, cb) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: page,
          pageSize,
        },
      },
      () => cb && cb(),
    );
  };

  loadData = _.debounce(
    ({ callback } = {}) => {
      this.setState({
        loading: true,
      });
      const {
        api: { url, method = 'GET', data: apiData, ...rest },
        onRefresh,
      } = this.props;
      const {
        apiOtherData,
        pagination: statePagination,
        pagination: { current: page, pageSize },
      } = this.state;
      const _apiData = { ...apiData, ...apiOtherData };
      let data = {
        page,
        pageSize,
        ..._apiData,
      };

      request(url, {
        method,
        [method === 'GET' ? 'params' : 'data']: data,
        ...rest,
      })
        .then(result => {
          const { dataFormat } = this.props;
          if (dataFormat) {
            result = dataFormat(result);
          }
          const { [RESPONSECODE]: code } = result;
          if (!code) {
            const { data: list, pagination } = result.data;
            //判断是否勾选checkbox
            const { autoRowSelection } = this.props;
            if (autoRowSelection.selectAll) {
              //翻页时候勾选所有checkbox
              const { unSelectedRowKeys } = this.state;
              //合并已勾选的 去掉已经没有勾选的
              const currentKeys = list.map(item => this.getRowKey(item));
              const selectedRowKeysAll = [...currentKeys];
              const _selectedRowKeys = selectedRowKeysAll.filter(
                item => !unSelectedRowKeys.some(i => i == item),
              );
              this.setState({
                selectedRowKeys: _selectedRowKeys,
              });
            }

            setTimeout(() => {
              this.setState(
                {
                  data: list,
                  pagination: {
                    ...pagination,
                    total: pagination.totalCount,
                    current: pagination.page,
                  },
                  loading: false,
                },
                () => {
                  callback && callback();
                  onRefresh && onRefresh(result);
                },
              );
            });
          }
        })
        .finally(() => {
          this.setState({
            loading: false,
          });
        });
    },
    100,
    true,
  );

  //改变check状态
  onSelectChangeCallback = () => {
    const { autoRowSelection: { onSelectChange } = {} } = this.props;
    if (!onSelectChange) return;
    const { total, selectedRowKeys, unSelectedRowKeys } = this.state;
    onSelectChange && onSelectChange(total, selectedRowKeys, unSelectedRowKeys);
  };

  //pageSize 变化的回调
  onShowSizeChange = (page, pageSize) => {
    if (pageSize === this.state.pagination.pageSize) return;
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          pageSize,
          current: 1,
        },
      },
      this.loadData,
    );
  };

  //页码改变的回调，参数是改变后的页码及每页条数
  onPageChange = page => {
    if (page === this.state.pagination.current) return;
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: page,
        },
      },
      this.loadData,
    );
  };

  //为columns 增加序号列
  onTrimColums = column => {
    column = column.filter(({ isInTable = true }) => isInTable);
    const { autoIndex } = this.props;
    if (autoIndex) {
      column.unshift({
        title: '序号',
        fixed: 'left',
        width: 62,
        dataIndex: this.enmu.tableNo,
        render: (no, record, index) => {
          const {
            pagination: { current, pageSize },
          } = this.state;
          return (
            <span className={style.commomTableTh}>{(current - 1) * pageSize + index + 1}</span>
          );
        },
      });
    }
    return column;
  };

  //增加ellipsis
  onAddEllipsis = columns => {
    return columns.map(item => {
      if (item.render) {
        return item;
      }
      if (typeof item.ellipsis === 'number') {
        return {
          ...item,
          render: t => (
            <Ellipsis length={item.ellipsis} tooltip>
              {t}
            </Ellipsis>
          ),
        };
      }
      if (typeof item.ellipsis === 'object') {
        return {
          ...item,
          render: t => <Ellipsis {...item.ellipsis}>{t}</Ellipsis>,
        };
      }
      return item;
    });
  };

  onTextAlign = columns => {
    return columns.map(item => {
      if (!('align' in item)) {
        item.align = 'center';
      }
      return item;
    });
  };

  onSelectChange = (selectedRowKeys, selectRows) => {
    this.setState({ selectedRowKeys });
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    if (!this.props.autoRowSelection.selectAll) return;
    const { unSelectedRowKeys } = this.state;
    const selectedRowsId = changeRows.map(item => this.getRowKey(item));
    if (!selected) {
      this.setState({
        unSelectedRowKeys: [...unSelectedRowKeys, ...selectedRowsId],
      });
    } else {
      this.setState({
        unSelectedRowKeys: _.difference(unSelectedRowKeys, selectedRowsId),
      });
    }
  };

  onSelectRow = (record, selected, rowCord) => {
    //缓存勾选掉的checkbox
    const { autoRowSelection } = this.props;
    if (autoRowSelection.selectAll) {
      const id = this.getRowKey(record);

      const { unSelectedRowKeys } = this.state;
      if (!selected) {
        this.setState({
          unSelectedRowKeys: [id, ...unSelectedRowKeys],
        });
      } else {
        this.setState({
          unSelectedRowKeys: unSelectedRowKeys.filter(item => item != id),
        });
      }
    }
  };

  getState = () => ({
    selectedRowKeys: this.state.selectedRowKeys,
    unSelectedRowKeys: this.state.unSelectedRowKeys,
  });

  compose = (funcs = [], init) => {
    return [...funcs].reduce((columns, fn) => {
      return fn(columns);
    }, init);
  };

  render() {
    const isSearchInput = !!this.props.search;
    const {
      columns,
      rowKey,
      autoRowSelection,
      autoRowSelection: { onClear } = {},
      children,
      autoStyle = true,
      style: tableStyle,
      bodyStyle,
      disabledSearch,
      ...rest
    } = this.props;

    const { data: dataSource, pagination, loading, selectedRowKeys, total } = this.state;
    let className = this.props.className || '';
    if (
      this.props.scroll &&
      this.props.scroll.x &&
      typeof this.props.scroll.x === 'boolean' &&
      autoStyle
    ) {
      className = classNames(className, style.tdNoWrap);
    }
    const props = {
      columns: this.compose(
        [this.onTextAlign, this.onAddEllipsis, this.onTrimColums],
        columns.slice(0),
      ),
      dataSource,
      rowKey: rowKey || this.enmu.rowId,
      pagination: {
        ...pagination,
        onChange: this.onPageChange,
        onShowSizeChange: this.onShowSizeChange,
        showTotal: () => `共${pagination.total}条`,
      },
      ...rest,
    };
    if (autoRowSelection.auto) {
      //增加checkbox
      props.rowSelection = {
        ...this.props.rowSelection,
        selectedRowKeys,
        onSelectAll: this.onSelectAll,
        onSelect: this.onSelectRow,
        onChange: this.onSelectChange,
      };
    }
    return (
      <>
        {autoRowSelection.alert && (
          <div className={style.tableAlert}>
            <Alert
              message={
                <>
                  已选择 <a style={{ fontWeight: 600 }}>{total}</a> 项&nbsp;&nbsp;{' '}
                  <a
                    onClick={() => {
                      this.setState({
                        selectedRowKeys: [],
                        unSelectedRowKeys: [],
                      });
                      onClear && onClear();
                    }}
                  >
                    清空
                  </a>
                </>
              }
              type="info"
              showIcon
            />
          </div>
        )}
        <Table {...props} className={className} loading={loading} style={{ ...tableStyle }} />
      </>
    );
  }
}
