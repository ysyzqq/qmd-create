import React from 'react';
import { Cascader } from 'antd';
import { toTreeData } from '@/utils/utils';
import request from '@/utils/request';

export default class Cascador extends React.PureComponent {
  state = {
    data: [],
    options: [],
  };
  async componentDidMount() {
    const { url, manual } = this.props;
    if (url && !manual) {
      await this.fetch(url);
      setTimeout(() => this.setValueFromProps(this.props, true), 100);
    }
  }

  convertValue = v => (Array.isArray(v) ? v[v.length - 1] : v);

  normalizeValue = v => {
    const { treeDataSimpleMode } = this.props;
    const pId = (treeDataSimpleMode && treeDataSimpleMode.pId) || 'pId';
    return [(this.state.data.find(i => i.id == v) || {})[pId], v];
  };

  componentWillReceiveProps(nextProps) {
    const { url, query } = nextProps
    JSON.stringify(query) != JSON.stringify(this.props.query)
    ?
    this.fetch(url, query).then(() => this.setValueFromProps(nextProps, true))
    :
    this.setValueFromProps(nextProps);
  }
  setValueFromProps(props, forceUpdate) {
    Reflect.has(props, 'value') &&
      (forceUpdate || JSON.stringify(props.value) != JSON.stringify(this.props.value)) &&
      this.setState({ value: this.normalizeValue(props.value) });
  }

  fetch = async (url, query) => {
    const { code, data } = await request(url, { params: query });
    code ||
      this.setState({
        data,
        options: this.formatData(data),
      });
  };
  onChange = v => {
    this.props.onChange(this.convertValue(v));
  };
  formatData = data => {
    const { treeDataSimpleMode } = this.props;
    return treeDataSimpleMode ? toTreeData(data, treeDataSimpleMode) : data;
  };
  render() {
    const { options, value } = this.state;
    const { treeDataSimpleMode, manual, query, preholder, placeholder, ...restProps } = this.props;
    const hasQuery = query && Object.values(query).filter(v => v !== undefined).length
    const casProps = {
      notFoundContent: '无匹配结果',
      ...restProps,
      options,
      onChange: this.onChange,
      placeholder: !query || hasQuery ? placeholder : preholder,
    };
    if (this.props.value !== undefined) {
      casProps.value = value
    }
    return <Cascader {...casProps} />;
  }
}
