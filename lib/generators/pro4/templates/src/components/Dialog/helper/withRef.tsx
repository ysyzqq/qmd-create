/**
 * withRef 传入一个组件 WrappedComponent
 * 通过 WithRef 属性 getInstance 函数
 * 反向注入到 WrappedComponent 的 ref 属性上
 */
import React, { PureComponent } from 'react';
import _ from 'lodash';

export interface IWithRefProps {
  getInstance?: Function;
  ref?: Function;
}

export default (WrappedComponent: React.ElementType) =>
  class WithRef extends PureComponent<IWithRefProps> {
    public render() {
      const props = { ...this.props };
      const { getInstance } = props;
      if (_.isFunction(getInstance)) {
        props.ref = getInstance;
      }
      return <WrappedComponent {...props} />;
    }
  };
