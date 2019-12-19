import React, { Component } from 'react';
import { Tree } from 'antd';
import PropTypes from 'prop-types';
import { toTreeData } from '@/utils/utils';

const { TreeNode } = Tree;

export default class AdvancedTree extends Component {
  static defaultProps = {
    treeData: [],
    treeDataSimpleMode: {},
  };
  static propTypes = {
    treeData: PropTypes.array,
    treeDataSimpleMode: PropTypes.object,
  };
  renderTreeNodes = (treeData, simpleFormat) => {
    const data = simpleFormat ? toTreeData(treeData, simpleFormat) : treeData;
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode {...item} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  };

  getParentKeys = (data, id) => {
    const self = data.find(i => i.id == id);
    if (!self) return [];
    if (self.parentId !== 0) {
      return [`${self.id}`, ...this.getParentKeys(data, self.parentId)];
    }
    return [`${self.id}`];
  };

  render() {
    const { expandSelectedParents, selectedKeys, treeData, treeDataSimpleMode, ...restProps } = this.props;
    const renderData = treeDataSimpleMode ? toTreeData(treeData, treeDataSimpleMode) : treeData;    
    const treeProps = {
      ...restProps,
      selectedKeys,
    }
    if (expandSelectedParents && treeDataSimpleMode && ~~selectedKeys) {
      const keys = this.getParentKeys(treeData, ~~selectedKeys)
      treeProps.defaultExpandedKeys = keys.filter(i => !selectedKeys.includes(i));
    }
    return (
      renderData && renderData.length &&
      <Tree {...treeProps}>{this.renderTreeNodes(renderData)}</Tree>
    )
  }
}
