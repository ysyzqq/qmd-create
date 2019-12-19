import React from 'react';
import AdvancedTree from './index';
import request from '@/utils/request';

export default class AutoLoadTree extends React.PureComponent {
  state = {
    treeData: [],
  };
  componentDidMount() {
    this.fetch();
  }
  fetch = async () => {
    const { url, query = {} } = this.props;
    const { code, data } = await request(url, { params: query });
    code || this.setState({ treeData: data });
  };
  render() {
    const { treeData } = this.state;
    const { url, ...restProps } = this.props;
    return (
      <AdvancedTree treeDataSimpleMode={{ title: 'name' }} treeData={treeData} {...restProps} />
    );
  }
}
