import React, { PureComponent, ReactElement } from 'react';
import { Input, Form, Row, Col, Button, Icon } from 'antd';
import { FormComponentProps, GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/es/form/Form';
import classNames from 'classnames';
import moment from 'moment';
import { stringify } from 'querystring';
import _ from 'lodash';
import { getPageQuery } from '@/utils/utils';
import styles from './index.less';

export interface FormItemEntity {
  name: string;
  valueType?: Function;
  colspan?: number;
  colProps?: {[key: string]: number};
  wrapperClassName?: string;
  label?: string;
  component?: React.ComponentType;
  deps?: string[] | string;
  render?: (form: WrappedFormUtils, depsValues?: any[]) => React.ReactNode;
  props?: any;
  defaultValue?: any;
  options?: GetFieldDecoratorOptions;
  dateFormatString?: string;
}
export interface FormItemGroupProps extends FormComponentProps {
  items: FormItemEntity[];
  autoSubmit?: boolean;
  resetButton?: boolean;
  onSearch?: (values: any) => void;
  cols?: number;
  screen?: 'screen-lg' | 'screen-xl' | 'screen-xxl';
  mergeQueryFromLocation?: boolean;
  exportBody?: { [key: string]: any };
  exportUrl?: string;
  searchHandleText?: string;
  className?: string;
  renderActions?: () => React.ReactNode;
}
const DEFAULTSCREENMAP = {
  'screen-lg': 2,
  'screen-xl': 3,
  'screen-xxl': 5,
};
class FormItemGroup extends PureComponent<FormItemGroupProps> {
  state = {
    simple: false,
    search: {},
  };
  // 目前只对从url获取的query做缓存, 之后如果跟新多, 改为Map
  query: { [key: string]: any } | null = null;

  getValues = () => {
    const { form, items } = this.props;
    const result = {};
    if (form) {
      const { getFieldsValue } = form;
      // console.info(getFieldsValue(), '--form--');
      _.forEach(getFieldsValue() || {}, (values, key) => {
        const item = items.find(_ => _.name == key);
        let keys = [key];
        if (key.indexOf(',') >= 0) {
          keys = key.split(',');
          values = values || []
        } else {
          values = [values];
        }
        _.forEach(keys, (name, i) => {
          let value = values[i];
          if (moment.isMoment(value)) {
            // begin,end处理
            let format: string = (item && item.dateFormatString) || 'YYYY-MM-DD HH:mm:ss'
            if (name.indexOf('begin') >= 0) {
              value = value.startOf('day').format(format)
            } else if (name.indexOf('end') >= 0) {
              value = value.endOf('day').format(format)
            } else {
              value = value.format(format);
            }
          }
          result[name.trim()] = value;
        });
      });
    }
    return result;
  };

  onSearch = (event?: any) => {
    const { onSearch } = this.props;
    event && _.isFunction(event.preventDefault) && event.preventDefault();
    const values = this.getValues();
    // console.info(values, '--sync')
    this.setState({ search: values });
    onSearch && onSearch(values);
  };

  delaySearch(delay: number = 90) {
    const { onSearch } = this.props;
    setTimeout(() => {
      const values = this.getValues(); // onchange触发时获取值有延迟
      // console.info(values, '--delay')
      this.setState({ search: values });
      onSearch && onSearch(values);
    }, delay);
  }

  getFieldsGrid = () => {
    let { cols = 2, screen = 'screen-lg', items } = this.props;
    cols = cols || DEFAULTSCREENMAP[screen] || 2;
    let size = 0;
    let sum = 0;
    for (const n of items.map(item => item.colspan || 1)) {
      if (sum + n > cols) {
        return size;
      } else {
        sum += n;
        size++;
      }
    }
    return size;
  };

  onFieldChange = () => {
    const { autoSubmit } = this.props;
    autoSubmit && this.delaySearch();
  };

  getValuesByQuery = () => {
    if (this.query) return this.query;
    const { mergeQueryFromLocation, items } = this.props;
    if (!mergeQueryFromLocation) return {};
    const { query } = { query: getPageQuery() };
    const values = {};
    items
      .filter(field => field.name)
      .forEach(({ name, valueType }) => {
        if (name.indexOf(',') > 0) {
          values[name] = [];
          name.split(',').forEach((n, i) => {
            n = n.trim();
            if (query[n]) values[name][i] = (valueType || String)(query[n]);
          });
        } else if (query[name]) values[name] = (valueType || String)(query[name]);
      });
    this.query = values;
    return values;
  };

  handleReset = () => {
    const { onSearch, form } = this.props;
    if (form) {
      const { resetFields } = form;
      resetFields();
      onSearch && onSearch({});
    }
  };

  normalizeEvent(e) {
    let value;
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    return value;
  }

  wrapFieldComponenet(cmp: ReactElement, field: FormItemEntity): ReactElement {
    const originOnChange = cmp.props.onChange;
    const onChange = e => {
      originOnChange && originOnChange(e); // 运行组件上自带的onchange
      this.onFieldChange();
    };
    return React.cloneElement(cmp, {
      onChange,
    });
  }

  getSearcher = () => {
    const {
      form,
      items,
      exportUrl,
      autoSubmit,
      searchHandleText = '搜索',
      resetButton = true,
      renderActions,
    } = this.props;
    if (!form) return null;
    const { simple } = this.state;
    const { getFieldDecorator, getFieldsValue } = form;
    const values = this.getValuesByQuery();
    const size = items.length; //this.getFieldsGrid();
    let viewedItems: any[] = [];
    const validComponents = items
      .map((field, i) => {
        let {
          name,
          deps,
          label,
          wrapperClassName,
          props = {},
          colspan,
          render,
          component: Component = Input,
          defaultValue,
          options = {},
          colProps: mapToCol = {},
        } = field;
        const { placeholder = `请输入${label}`, ...restProps } = props;
        const mergeProps = { ...restProps, placeholder };
        const cols = colspan || 1;
        const defaultColProps = {
          xxl: 6 * cols,
          xl: 6 * cols,
          lg: 8 * cols,
          md: 12 * cols,
          className: wrapperClassName,
          key: name || i,
        };
        let colProps = {
          ...defaultColProps,
          ...mapToCol,
        }
        const initialValue =
          values[name] || (_.isFunction(defaultValue) ? defaultValue.bind(this)() : defaultValue);
        let FieldComponent: any = null;
        if (_.isFunction(render)) {
          let depsValues: any = null;
          if (deps) {
            if (typeof deps === 'string') deps = [deps];
            depsValues = getFieldsValue(deps);
            // console.info(deps, depsValues, 'deps')
          }
          FieldComponent = render.bind(this)(form, depsValues);
        } else {
          FieldComponent = <Component {...mergeProps} />;
        }
        if (name) {
          if (FieldComponent == null || !React.isValidElement(FieldComponent)) {
            return null;
          }
          viewedItems.push(field);
          FieldComponent = this.wrapFieldComponenet(FieldComponent, field);
          return (
            <Col {...colProps}>
              <Form.Item label={label}>
                {getFieldDecorator(name, { initialValue, ...options })(FieldComponent)}
              </Form.Item>
            </Col>
          );
        }
        viewedItems.push(field);
        return (
          <Col {...colProps}>
            <div className="ant-row ant-form-item">
              {label ? (
                <div className="ant-form-item-label">
                  <label>{label}</label>
                </div>
              ) : null}
              <div className="ant-form-item-control-wrapper">
                <div className="ant-form-item-control">{FieldComponent}</div>
              </div>
            </div>
          </Col>
        );
      })
      .filter(cmp => cmp);
    const viewedComponents = simple ? validComponents.slice(0, size) : validComponents;
    viewedItems = simple ? viewedItems.slice(0, size) : viewedItems;
    if (viewedComponents.length <= 0) {
      // 只有actions
      return (
        <div className={styles.searcher}>
          <Row>
            <Col>
              <div className={styles.actions}>{renderActions && renderActions()}</div>
            </Col>
          </Row>
        </div>
      );
    }
    const actionsColProps = this.getActionsColProps(viewedItems as any as FormItemEntity[]);
    return (
      <div className={styles.searcher}>
        <Form onSubmit={this.onSearch} layout="inline">
          <Row gutter={16}>
            {viewedComponents}
            <Col {...actionsColProps}>
              <div className={styles.actions}>
                {!autoSubmit ? (
                  <Button type="primary" htmlType="submit">
                    {searchHandleText}
                  </Button>
                ) : null}
                {resetButton ? (
                  <Button type="primary" onClick={this.handleReset}>
                    重置
                  </Button>
                ) : null}
                {exportUrl ? <Button onClick={() => this.exportData()}>导出</Button> : null}
                {renderActions && renderActions()}
                {validComponents.length > size ? (
                  <a onClick={this.toggleForm}>
                    {simple ? (
                      <span>
                        展开 <Icon type="down" />
                      </span>
                    ) : (
                      <span>
                        收起 <Icon type="up" />
                      </span>
                    )}
                  </a>
                ) : null}
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };
  getActionsColProps = (viewedItems: FormItemEntity[]) => {
    let colProps = {
      xxl: 0,
      xl: 0,
      lg: 0,
      md: 0,
    };
    viewedItems.forEach(item => {
      const { colspan = 1, colProps: mapcol} = item;
      if (mapcol && typeof mapcol === 'object') {
        colProps.xxl += (mapcol.xxl || 6);
        colProps.xl += (mapcol.xl || 6);
        colProps.lg += (mapcol.lg || 8);
        colProps.md += (mapcol.md || 12);
      } else {
        colProps.xxl += colspan * 6;
        colProps.xl += colspan * 6;
        colProps.lg += colspan * 8;
        colProps.md += colspan * 12;
      }
    });
    Object.keys(colProps).forEach(key => {
      if (colProps[key] % 24 === 0) {
        colProps[key] = 24;
      } else {
        let rest = 24 - colProps[key] % 24;
        colProps[key] = rest;
      }
    })
    return colProps;
  }
  exportData() {
    const { search } = this.state;
    const { exportBody, exportUrl } = this.props;
    const params = _.assign(exportBody, search);
    window.location.href = `${exportUrl}?${stringify(params)}`;
  }
  toggleForm = () => {
    this.setState({
      simple: !this.state.simple,
    });
  };

  render() {
    let { className } = this.props;
    return <div className={classNames('form-items', className)}>{this.getSearcher()}</div>;
  }
}

export default Form.create<FormItemGroupProps>()(FormItemGroup);
