import React, { PureComponent } from 'react';
import { TreeSelect } from 'antd';
import request from '@/utils/request';

export default class Departments extends PureComponent {
  state = {
    treeData: [],
  };

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const { code, data } = await request('/api/catelogue');
    if (!code) {
      this.setState({ treeData: data.map(i => ({ ...i, value: `${i.id}`, title: i.name })) });
    }
  }

  render() {
    return (
      <TreeSelect
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={this.state.treeData}
        treeDataSimpleMode={{ id: 'id', pId: 'parentId', rootPId: 0 }}
        {...this.props}
      />
    );
  }
}
