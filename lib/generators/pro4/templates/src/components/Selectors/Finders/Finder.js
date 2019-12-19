import React from 'react';
import _ from 'lodash';
import { Select, message, Icon } from 'antd';
import request from '@/utils/request';

const { Option } = Select;

export default function DefaultFinder(props) {
  const defaultProps = {
    keyName: 'key',
    labelName: 'label',
    searchName: 'name',
    defaultName: 'default',
    showSearch: true,
    searchOnFocus: true,
  };
  return <BasicFinder {...defaultProps} {...props} />;
}

class BasicFinder extends React.PureComponent {
  state = {
    data: [],
  };
  componentDidMount() {
    this.setValueFromProps(this.props, true);
  }
  componentWillReceiveProps(nextProps) {
    this.setValueFromProps(nextProps);
  }
  setValueFromProps(props, firstTime) {
    const { keyName, labelName, defaultName, mode, showSearch } = props;
    if (!showSearch) return firstTime && this.fetchData();
    const multiple = mode == 'multiple';
    if (
      defaultName &&
      props[defaultName] &&
      // props.defaultName && props[props.defaultName] && props[props.defaultName][keyName] && props[props.defaultName][labelName] &&
      // !(this.state.data && this.state.data.length) &&
      (firstTime || JSON.stringify(props[defaultName]) != JSON.stringify(this.props[defaultName]))
    ) {
      if (multiple && Array.isArray(props[defaultName])) {
        this.setState({ data: props[defaultName] });
      } else {
        this.setState({ data: [props[defaultName]] });
      }
    }
  }

  handleSearch = value => this.fetchData(value);

  handleSelect = (value, option) => {
    const { keyName, labelName, labelInValue, onSelect, type } = this.props;
    const key = labelInValue ? value.key : value;
    const label = option.props.title;
    this.setState({
      data: [
        {
          [keyName]: key,
          [labelName]: label,
        },
      ],
    });
    if (type) {
      const finders = JSON.parse(sessionStorage.getItem('Finders')) || {};
      const finder = Array.isArray(finders[type]) ? finders[type] : [];
      const hasValue = finder.findIndex(i => i[keyName] == key) + 1;
      if (!hasValue) {
        finder.push({ [keyName]: key, [labelName]: label });
        finders[type] = finder;
        sessionStorage.setItem('Finders', JSON.stringify(finders));
      }
    }
    onSelect && onSelect(value);
  };
  handleFocus = () => {
    this.props.searchOnFocus && this.fetchData();
  };
  fetchData = async value => {
    const { url, searchName } = this.props;
    const { query = {}, requestOptions } = this.props
    if (value) query[searchName] = value
    this.setState({ loading: true });
    const res = await request(url, requestOptions || { params: query });
    this.setState({ loading: false });
    if (res.code) return message.error(res.message);
    this.setState({ data: res.data });
  };
  render() {
    const { valueType, type, mode, keyName, labelName, renderLabel, ...restProps } = this.props;
    const { data, loading } = this.state;
    const hasValueProp = Reflect.has(restProps, 'value');
    if (hasValueProp && !restProps.labelInValue) {
      restProps.value =
        restProps.value &&
        (mode == 'multiple'
          ? Array.isArray(restProps.value)
            ? restProps.value
            : valueType == 'string'
              ? restProps.value.split(',')
              : restProps.value.split(',').map(i => ~~i)
          : valueType == 'string' ? restProps.value : ~~restProps.value);
      // valueType == 'string' ?
      // restProps.value :
      // Array.isArray(restProps.value) || mode == 'multiple' ? restProps.value : ~~restProps.value
    }
    const newData = [...data];
    if (type && hasValueProp && restProps.value != undefined) {
      const key = restProps.labelInValue ? restProps.value.key : restProps.value;
      const hasValue = data.findIndex(o => o[keyName] == key) + 1;
      if (!hasValue) {
        const finders = JSON.parse(sessionStorage.getItem('Finders')) || {};
        const finder = finders[type] || [];
        const option = finder.find(o => o[keyName] == key);
        option && newData.push(option);
      }
    }
    return (
      <Select
        {...restProps}
        mode={mode}
        getPopupContainer={node => node.parentNode}
        onSelect={this.handleSelect}
        optionLabelProp="title"
        // tokenSplit={[',']}
        onSearch={_.debounce(this.handleSearch, 200)}
        onFocus={this.handleFocus}
        notFoundContent={loading ? <Icon type="loading" /> : '无匹配结果'}
        filterOption={(input, option) =>
          option.props.children && option.props.children.includes(input)
        }>
        {newData.map(i => (
          <Option title={i[labelName]} key={`${i[keyName]}`} value={i[keyName]}>
            {renderLabel ? renderLabel(i) : i[labelName]}
          </Option>
        ))}
      </Select>
    );
  }
}
