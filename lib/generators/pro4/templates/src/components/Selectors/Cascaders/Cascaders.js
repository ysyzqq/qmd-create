import React from 'react';
import Cascader from './Cascader';

/* eslint-disable react/no-multi-comp */

export class PostCascader extends React.PureComponent {
  render() {
    const { ...restProps } = this.props;
    const cusProps = {
      showSearch: true,
      placeholder: '职位选择',
      url: '/api/personnel/jobs/list',
      treeDataSimpleMode: {
        pId: 'parentId',
        value: 'id',
        label: 'name',
      },
    };
    const casProps = {
      ...cusProps,
      ...restProps,
    };
    return <Cascader {...casProps} />;
  }
}

export class RankCascader extends React.PureComponent {
  render() {
    const { ...restProps } = this.props;
    const cusProps = {
      showSearch: true,
      placeholder: '职级选择',
      url: '/api/personnel/joblevels/list',
      treeDataSimpleMode: {
        pId: 'parentId',
        value: 'id',
        label: 'name',
      },
    };
    const casProps = {      
      ...cusProps,
      ...restProps,
    };
    return <Cascader {...casProps} />;
  }
}
