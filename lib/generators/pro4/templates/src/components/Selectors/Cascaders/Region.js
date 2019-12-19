import React from 'react';
import { Cascader } from 'antd';
import { toTreeData } from '@/utils/utils';
import request from '@/utils/request';

export default class Region extends React.PureComponent {
  state = {
    data: [],
    options: [],
  };
  static defaultProps = {
    level: 2,
    dataUrl: v => `/api/areas?parentCode=${v}`,
    infoUrl: v => `/api/areas/${v}`,
    treeDataSimpleMode: {
      id: 'areaCode',
      pId: 'parentCode',
      rootPId: '100000',
      value: 'areaCode',
      label: 'shortName',
      isLeaf: item => item.levelType >= 2,
    },
  };
  componentDidMount() {
    const { treeDataSimpleMode: { rootPId } } = this.props;
    this.fetch(rootPId).then(res => res.code || this.seveState(res.data));
    this.setValueFromProps(this.props, true);
  }
  componentWillReceiveProps(nextProps) {
    this.setValueFromProps(nextProps);
  }
  onChange = v => this.props.onChange(this.convertValue(v));
  convertValue = v => (Array.isArray(v) ? v[v.length - 1] : v);
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.fetch(targetOption[this.props.treeDataSimpleMode.id]).then(res => {
      targetOption.loading = false;
      res.code || this.seveState([...this.state.data, ...res.data]);
    });
  };

  fetch = code => request(this.props.dataUrl(code));
  fetchInfo = code => request(this.props.infoUrl(code));
  isExist = v => this.state.data.findIndex(i => i[this.props.treeDataSimpleMode.id] == v) > -1;

  setValueFromProps(props, firstTime) {
    if (
      Reflect.has(props, 'value') &&
      (firstTime || JSON.stringify(props.value) != JSON.stringify(this.props.value))
    ) {
      if (props.value) {
        if (!this.isExist(props.value)) {
          this.getFullData(props.value);
        } else {
          this.setState({ value: this.normalizeValue(props.value) });
        }
      } else {
        this.setState({ value: props.value });
      }
    }
  }

  getFullData = async v => {
    const { treeDataSimpleMode: { pId, rootPId } } = this.props;
    const value = [];
    const getChinldren = async v => {
      value.unshift(v);
      const { code, data } = await this.fetchInfo(v);
      if (code) return 0;
      const parentId = data[pId];
      if (parentId == rootPId) return this.setState({ value });
      if (!code) {
        getChinldren(parentId);
        const res = await this.fetch(parentId);
        res.code || this.seveState([...this.state.data, ...res.data]);
      }
    };
    getChinldren(v);
  };
  seveState = data => this.setState({ data, options: this.formatData(data) });
  normalizeValue = v => {
    const { treeDataSimpleMode: { id = 'id', pId = 'pId', rootPId } } = this.props;
    const value = [];
    const getParent = v => {
      value.unshift(v);
      const parentId = (this.state.data.find(i => i[id] == v) || {})[pId];
      if (parentId == rootPId) return 0;
      getParent(parentId);
    };
    getParent(v);
    return value;
  };
  formatData = data => {
    const { treeDataSimpleMode } = this.props;
    return treeDataSimpleMode ? toTreeData(data, treeDataSimpleMode) : data;
  };

  render() {
    const { options, value } = this.state;
    const { dataUrl, infoUrl, treeDataSimpleMode, ...restProps } = this.props;
    const casProps = {
      placeholder: '请选择地区',
      ...restProps,
      options,
      value,
      loadData: this.loadData,
      onChange: this.onChange,      
    };
    return <Cascader {...casProps} />;
  }
}
