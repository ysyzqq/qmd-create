/**
 * @file 一屏展示表格
 * @author ye.chen
 */
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types'
import { Table } from 'antd';
import _ from 'lodash';

const compare = (ary, arr) => ary.map((v, i) => v > arr[i] ? v : arr[i]);
const getTotal = (list) => list.reduce((total, num) => total + num);
const batchAddAttr = (target, list, attrName) => target.map((v, i) => {
  if (v[attrName] == null) {
    // console.info(v[attrName], '--width')
    v.patchedWidth = true;
    console.info(`col${i}--${list[i]}`)
    v[attrName] = list[i] + 15;   // 解决 table item 中外宽与内宽混乱的问题，预留一定长度保证样式不出错，
  } 
  // console.info(v[attrName], '---')
  return v;
});
let getTop = (obj) => {   // offsetTop 与 oofsetParent 的浏览器兼容性比 Element.getBoundingClientRect() 高。 
  let t = obj.offsetTop;   
  while (obj = obj.offsetParent) { 
    t += obj.offsetTop;
  }
  return t;
}

class ScreenTable extends PureComponent {

  state = {
    widthList: null,
    firstLock: false,
    offsetTop: 0,
  };

  componentDidMount() {
    this.screenTable = document.querySelector('#screen-table');
    const {onRef} = this.props;
    onRef && onRef(this);
    this.refreshWithDebounce = _.debounce(() => this.refresh(), 400)
    window.addEventListener('resize', this.refreshWithDebounce)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.refreshWithDebounce)
  }

  componentDidUpdate(prevProps) {
    let {state: {firstLock, offsetTop}, props: {dataSource, noScrollX}} = this;
    if (this.screenTable) {
      let nowOffsetTop = getTop(this.screenTable);
      if (nowOffsetTop !== offsetTop) this.setState({offsetTop: nowOffsetTop});
    }
    if (prevProps.dataSource === dataSource || dataSource.length <= 0 || noScrollX) return;
    // this.setState({firstLock: true}, () => {
    //   this.refresh();
    // });
    // console.info('--refresh--')
    this.refresh()
  }

  refresh = () => {
    const {dataSource, columns} = this.props;
    if (dataSource.length <= 0) return;
    // 还原columns的width
    columns.map(col => {
      if (col.patchedWidth) {
        delete col.width;
        delete col.patchedWidth;
      }
    })
    this.setState({widthList: null}, () => {
      if (!this.table) return null;
      if (!this.tableDOM) this.tableDOM = findDOMNode(this.table);
      const thWidthList = [...this.tableDOM.querySelectorAll('#screen-table .ant-table-scroll .ant-table-header .ant-table-thead th')].map(v => v.offsetWidth);
      const tdWidthList = [...this.tableDOM.querySelectorAll('#screen-table .ant-table-scroll .ant-table-body .ant-table-row')[0].querySelectorAll('td')].map(v => v.offsetWidth);
      const widthList = compare(thWidthList, tdWidthList);
      this.setState({widthList});
    });
  }

  handleTableRef = el => this.table = el;

  render() {
    let {scroll = {}, columns, onRef, noScrollX, ...restProps} = this.props,
      {widthList, offsetTop} = this.state;
    scroll.x = true, scroll.y = scroll.y || window.innerHeight - offsetTop - 120;
    if (noScrollX) {
      delete scroll.x;
    }
    console.info(widthList, '--')
    if (!noScrollX && widthList && widthList.length > 0) {
      // console.info(columns, widthList,  '--patch')
      columns = batchAddAttr(columns, widthList, 'width');
      scroll.x = getTotal(widthList);
    }
    return (
      <div id="screen-table">
        <Table
          ref={this.handleTableRef}
          {...restProps}
          columns={columns}
          scroll={scroll}
        />
      </div>
    )
  }
}

ScreenTable.propTypes = {
  noScrollX: PropTypes.bool,    // 禁用表格横向滚动，在不需要横向滚动的时候添加该选项可以减少不必要的性能开支
  scroll: PropTypes.object,
  onRef: PropTypes.func,        // 父组件调用 refresh 方法
}

export default ScreenTable;