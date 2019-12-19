import React, { PureComponent } from 'react';
import { TreeSelect, Tooltip } from 'antd';
import request, {RESPONSECODE} from '@/utils/request';

const { SHOW_ALL, SHOW_PARENT } = TreeSelect;

export default class Departments extends PureComponent {
  state = {
    treeData: [],
  };
  componentDidMount() {
    this.fetch();
  }
  async fetch() {
    const { [RESPONSECODE]: code, data } = await request(this.props.url);
    if (!code) {
      this.setState({ treeData: data.map(i => ({ ...i, value: `${i.id}`, title: i.name })) });
    }
  }
  render() {
    const { treeData } = this.state;
    const { showParent, dropdownStyle, ...restProps } = this.props;
    const comProps = {
      treeData,
      showSearch: true,
      placeholder: '请选择',
      dropdownStyle: { ...dropdownStyle, maxHeight: 400, overflow: 'auto' },
      treeDataSimpleMode: { id: 'id', pId: 'parentId', rootPId: 0 },
      treeNodeFilterProp: 'title',
      ...restProps,
    };
    if (showParent) {
      comProps.treeCheckable = true;
      comProps.showCheckedStrategy = SHOW_PARENT;
    }
    return (
      <TreeSelect
        // maxTagPlaceholder: omittedValues => {console.log('omittedValues', omittedValues); return <Tooltip title={omittedValues}>...</Tooltip>},
        {...comProps}
      />
    );
  }
}

Departments.SHOW_ALL = SHOW_ALL;
Departments.SHOW_PARENT = SHOW_PARENT;
