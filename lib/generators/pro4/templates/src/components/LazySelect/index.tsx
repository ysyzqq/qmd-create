import React from 'react';
import { Select, Spin, Dropdown, Menu, Radio } from 'antd';
import { SelectProps } from 'antd/es/select/';
import { DropDownProps } from 'antd/es/dropdown';
import { RadioGroupProps } from 'antd/es/radio/';
import { session } from '@/utils/';
import request, { RequestOptionsInit } from '@/utils/request';
import _ from 'lodash';

type Mode =  'select' | 'dropdown' | 'radioGroup'
export interface BasePorps {
  api: {
    url: string;
    options?: RequestOptionsInit;
  };
  uid: string;
  mode: Mode;
  valuePropName?: string;
  labelPropName?: string;
  needAll?: boolean;
  cache?: boolean;
  lazy?: boolean;
  value?: any;
  onChange?: (val: any, target?: any) => void;
  sourceFormatter: (val: any) => { list: any[] };
  renderMenu?: (...args: any[]) => React.ReactNode;
  optionFilter?: (val: any[]) => any[];
  antMode?: 'multiple' | 'tags';
  renderLabel?: (item: any) => React.ReactNode;
}
type ModePorps = Partial<SelectProps>  & Partial<DropDownProps> & Partial<RadioGroupProps>;
export type LazySelectProps = BasePorps & ModePorps;

export default class LazySelect extends React.Component<LazySelectProps, any> {
  static prefix = 'sxy_manage_';
  static defaultProps = {
    valuePropName: 'id',
    labelPropName: 'value',
    needAll: false,
    cache: false,
    lazy: false,
    sourceFormatter: res => {
      // console.info(res, '--')
      return { ...res, list: res.data }
    },
    mode: 'select',
  };

  init: boolean = false;

  getInitSelectOptions(props, sessionPrefix) {
    const { cache, uid } = props;
    return cache && uid ? session(sessionPrefix) || [] : [];
  }

  constructor(props) {
    super(props);
    this.init = false;
    const sessionPrefix = `${LazySelect.prefix}${props.uid}`;
    this.state = {
      value: props.value || props.defaultValue,
      sessionPrefix,
      selectOptions: this.getInitSelectOptions(props, sessionPrefix),
      uid: props.uid || '',
      loading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.getSelectOptions = this.getSelectOptions.bind(this);
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    const needSync = name => {
      return !_.isEqual(props[name], prevProps[name]);
    };
    const sessionPrefix = `${LazySelect.prefix}${props.uid}`;
    if (needSync('uid')) {
      this.setState(
        {
          value: '',
          uid: props.uid,
          sessionPrefix,
          selectOptions: this.getInitSelectOptions(props, sessionPrefix),
        },
        () => this.getSelectOptions(),
      );
    } else if (needSync('value')) {
      this.setState({
        value: props.value,
      });
    } else if (needSync('api')) {
      this.setState(
        {
          value: '',
          selectOptions: this.getInitSelectOptions(props, this.state.sessionPrefix),
        },
        () => this.getSelectOptions(),
      );
    }
  }

  reset() {
    const { cache = false, uid } = this.props;
    const { sessionPrefix } = this.state;
    if (cache && uid) {
      session(sessionPrefix, null);
    }
    this.setState(
      {
        value: '',
        selectOptions: [],
      },
      () => this.getSelectOptions(true),
    );
  }

  componentDidMount() {
    const { lazy = false } = this.props;
    if (!lazy) {
      this.getSelectOptions(true);
    }
  }

  async getSelectOptions(force = false) {
    const { uid: type, selectOptions, sessionPrefix } = this.state;
    const { cache = false, api, sourceFormatter } = this.props;
    if (!type) return;
    if (!force && this.init) return;
    if (cache) {
      if (selectOptions.length > 0) {
        if (!this.init) this.init = true;
        this.forceUpdate();
        return;
      }
    }
    try {
      this.setState({ loading: true });
      const { url, options } = api;
      const {list = []} = sourceFormatter((await request(url, { ...options })) || {});
      if (!this.init) {
        this.init = true;
      }
      this.setState({
        selectOptions: list,
      });
      session(sessionPrefix, list);
    } catch (e) {
      throw new Error(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  normalizeEvent(e) {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    return value;
  }

  onChange(e) {
    const { onChange, valuePropName = 'id' } = this.props;
    const { selectOptions } = this.state;
    const value = this.normalizeEvent(e);
    const target = Array.isArray(value)
      ? selectOptions.filter(_ => value.includes(_[valuePropName]))
      : selectOptions.find(_ => _[valuePropName] == value);
    this.setState(
      {
        value,
      },
      () => {
        onChange && onChange(value, target);
      },
    );
  }

  renderSelect() {
    const { selectOptions: originOptions, value, loading } = this.state;
    let {
      mode,
      antMode,
      uid,
      value: propValue,
      onChange,
      valuePropName = 'id',
      labelPropName = 'value',
      needAll = false,
      lazy = false,
      optionFilter,
      optionLabelProp,
      renderLabel,
      ...others
    } = this.props;
    let selectOptions = [...originOptions];
    let filteredOptions = optionFilter && optionFilter([...originOptions]);
    if (filteredOptions && Array.isArray(filteredOptions)) {
      selectOptions = [...filteredOptions];
    }
    if (needAll) {
      selectOptions = [{ [valuePropName]: '@@all', [labelPropName]: '全部' }, ...selectOptions];
    }
    if (lazy) {
      others = {
        ...others,
        onFocus: () => {
          this.getSelectOptions();
          this.props.onFocus && this.props.onFocus();
        },
      };
    } else {
      others = {
        ...others,
        onFocus: () => {
          this.props.onFocus && this.props.onFocus();
        },
      };
    }
    const mapDomProps = item => {
      return optionLabelProp ? { [optionLabelProp]: item[optionLabelProp] } : null;
    };
    return (
      <Select
        {...others}
        optionLabelProp={optionLabelProp}
        mode={antMode}
        value={this.init ? value : undefined}
        onChange={this.onChange}
        notFoundContent={loading ? <Spin size="small" /> : null}
      >
        {selectOptions.map(item => (
          <Select.Option
            {...mapDomProps(item)}
            value={item[valuePropName]}
            key={item[valuePropName]}
          >
            {renderLabel ? renderLabel(item) : item[labelPropName]}
          </Select.Option>
        ))}
      </Select>
    );
  }

  renderDropDown() {
    let { selectOptions: originOptions } = this.state;
    let {
      uid,
      value: propValue,
      onChange,
      valuePropName = 'id',
      labelPropName = 'value',
      needAll,
      lazy,
      renderMenu,
      children,
      ...others
    } = this.props;
    if (needAll) {
      originOptions = [
        { [valuePropName]: 'default_all', [labelPropName]: '全部' },
        ...originOptions,
      ];
    }
    const defaultMenu = (
      <Menu onClick={({ item, key, keyPath }) => this.onChange(key)}>
        {originOptions.map(_ => (
          <Menu.Item key={_[valuePropName]}>{_[labelPropName]}</Menu.Item>
        ))}
      </Menu>
    );
    const onClick = e => {
      if (lazy) {
        this.getSelectOptions();
      }
    };
    let menu = (renderMenu && renderMenu([...originOptions])) || defaultMenu;
    return (
      <Dropdown overlay={menu} {...others}>
        <a className="ant-dropdown-link" href="#" onClick={onClick}>
          {children}
        </a>
      </Dropdown>
    );
  }

  renderRadioGroup() {
    let { selectOptions: originOptions, value } = this.state;
    const {
      uid,
      value: propValue,
      onChange,
      valuePropName = 'id',
      labelPropName = 'value',
      needAll,
      lazy,
      optionFilter,
      ...others
    } = this.props;
    let selectOptions = [...originOptions];
    let filteredOptions = optionFilter && optionFilter([...originOptions]);
    if (filteredOptions && Array.isArray(filteredOptions)) {
      selectOptions = [...filteredOptions];
    }
    if (needAll) {
      selectOptions = [{ [valuePropName]: '', [labelPropName]: '全部' }, ...selectOptions];
    }
    return (
      <Radio.Group {...others} onChange={this.onChange} value={value}>
        {selectOptions.map(_ => (
          <Radio key={_[valuePropName]} value={_[valuePropName]}>
            {_[labelPropName]}
          </Radio>
        ))}
      </Radio.Group>
    );
  }

  render() {
    const mode: Mode = this.props.mode;
    switch (mode) {
      case 'select':
        return this.renderSelect();
      case 'dropdown':
        return this.renderDropDown();
      case 'radioGroup':
        return this.renderRadioGroup();
      default:
        return null;
    }
  }
}
