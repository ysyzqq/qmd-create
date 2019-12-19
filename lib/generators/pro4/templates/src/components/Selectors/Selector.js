import React from 'react';
import { Select, Checkbox, Radio } from 'antd';
import request from '@/utils/request';
import { aliasToCode, aliasInDM, aliasToDMUrl, isStringValue, codeToAlias } from '@/utils/enums';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

export default class Selector extends React.PureComponent {
  state = {
    data: [],
  };
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    const { code, alias } = this.props;
    const isDM = aliasInDM(alias);
    if (isDM) {
      const res = await aliasToDMUrl(alias)();
      this.fetchData(undefined, res);
    } else {
      const localDD = {};
      // const localDD = JSON.parse(sessionStorage.getItem('DD')) || {};
      const typeCode = code || aliasToCode(alias);
      if (Object.keys(localDD).includes(typeCode)) {
        this.setState({ data: localDD[typeCode] });
      } else {
        const url = `/api/sysdic/getDics?typeCode=${typeCode}`;
        const res = await this.fetchData(url);
        res.data &&
          sessionStorage.setItem(
            'DD',
            JSON.stringify({ ...JSON.parse(sessionStorage.getItem('DD')), [typeCode]: res.data })
          );
      }
    }
  };
  handleSelect = (value, option) => {
    const { code: typeCode, alias: tempAlias, labelInValue, onSelect } = this.props;
    const alias = tempAlias || codeToAlias(typeCode);
    const key = labelInValue ? value.key : value;
    const code = aliasInDM(alias) ? 'id' : 'code';
    if (alias) {
      const selectors = JSON.parse(sessionStorage.getItem('Selectors')) || {};
      const selector = Array.isArray(selectors[alias]) ? selectors[alias] : [];
      const hasValue = selector.findIndex(i => i[code] == key) + 1;
      if (!hasValue) {
        selector.push({ [code]: key, name: option.props.children });
        selectors[alias] = selector;
        sessionStorage.setItem('Selectors', JSON.stringify(selectors));
      }
    }
    onSelect && onSelect(value, option);
  };
  fetchData = async (url, res) => {
    const { selectFirst } = this.props
    res = res || (await request(url));
    if (res.code) return;
    this.setState({ data: res.data });
    if (selectFirst && res.data && Array.isArray(res.data) && res.data[0]) {
      const item = res.data[0]
      this.props.onChange(item.id, { props: { 'data-item': item}})
    }
    return res;
  };
  render() {
    const { code: typeCode, alias: tempAlias, appear, extraFilter, ...restProps } = this.props;
    const { data } = this.state;
    const alias = tempAlias || codeToAlias(typeCode);
    const code = aliasInDM(alias) ? 'id' : 'code';
    const stringValue = isStringValue(alias);
    const hasValueProp = Reflect.has(restProps, 'value');
    if (hasValueProp && !appear) {
      restProps.value =
        restProps.value &&
        (restProps.mode == 'multiple'
          ? Array.isArray(restProps.value)
            ? restProps.value
            : stringValue ? restProps.value.split(',') : restProps.value.split(',').map(i => ~~i)
          : stringValue ? restProps.value : ~~restProps.value);
    }
    const newData = [...data];
    if (alias && hasValueProp && restProps.value != undefined) {
      const key = restProps.labelInValue ? restProps.value.key : restProps.value;
      const hasValue = data.findIndex(o => o[code] == key) + 1;
      if (!hasValue) {
        const selectors = JSON.parse(sessionStorage.getItem('Selectors')) || {};
        const selector = selectors[alias] || [];
        const option = selector.find(o => o[code] == key);
        option && newData.push(option);
      }
    }
    // 没有option的时候不给选择框传值
    if (!newData.length && hasValueProp && restProps.value != undefined) {
      restProps.value = undefined;
    }

    switch (appear) {
      case 'checkbox':
        return (
          <CheckboxGroup
            options={data.map(i => ({ value: i[code], label: i.name }))}
            {...restProps}
          />
        );
      case 'radio':
        return (
          <RadioGroup options={data.map(i => ({ value: i[code], label: i.name }))} {...restProps} />
        );
      default:
        return (
          <Select
            onSelect={this.handleSelect}
            {...restProps}
            getPopupContainer={node => node.parentNode}
            filterOption={(input, option) => option.props.children.includes(input)}>
            {(extraFilter ? newData.filter(i => extraFilter(i[code])) : newData).map(i => (
              <Option key={i[code]} value={i[code]} data-item={i}>
                {i.name}
              </Option>
            ))}
          </Select>
        );
    }
  }
}
