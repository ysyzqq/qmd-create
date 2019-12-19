import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classnames from 'classnames';
import { Form, Modal, Input, Button } from 'antd';
import { history } from '@/utils/history';
import request, {RESPONSECODE, RESPONSEDATA} from '@/utils/request';
import { ValidationRule } from 'antd/lib/form/Form';
import { withRef, withSetProps } from './helper';
import autodata, { TOptions as TOptionsAutodata } from '@/components/HOC/autodata';
import styles from './index.less';
import { TDialogProps, TBody, TOptions, IPrompt, DialogInstance } from './types';
import { ModalProps } from 'antd/lib/modal';

const { create: FormCreate, Item: FormItem } = Form;
const withAutodata = autodata;
export default class Dialog extends PureComponent<TDialogProps> {
  static open: (options: TOptionsWithState) => void;
  static prompt: (options: IPrompt) => void;
  private unsubscribe: any;
  private destroy: any;
  public componentDidMount() {
    this.unsubscribe = history.listen(() => this.destroy && this.destroy());
  }
  public componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }
  public render() {
    const {
      onOk,
      onCancel,
      transition,
      render,
      content,
      title,
      titleRender,
      footerRender,
      confirmLoading,
      okText,
      cancelText,
      formProps,
      props,
      okButtonProps,
      ...restProps
    } = this.props;
    let modalProps = {
      wrapClassName: styles.center,
      visible: true,
      onOk: onOk && onOk.bind(this),
      onCancel: onCancel && onCancel.bind(this),
      title,
      footer: [
        <Button
          {...okButtonProps}
          onClick={onOk && onOk.bind(this)}
          loading={confirmLoading}
          type="primary"
          key="ok"
        >
          {!okText ? '确定' : okText}
        </Button>,
        <Button onClick={onCancel && onCancel.bind(this)} key="cancel">
          {!cancelText ? '取消' : cancelText}
        </Button>,
      ],
      ...props,
      ...restProps,
    } as ModalProps;
    if (_.isBoolean(transition) && !transition) {
      modalProps = { ...modalProps, transitionName: '', maskTransitionName: '' };
    }
    if (_.isFunction(titleRender)) {
      modalProps = { ...modalProps, title: titleRender.apply(this) || title };
    }
    if (_.isFunction(footerRender)) {
      modalProps = { ...modalProps, footer: footerRender.apply(this) || null };
    }
    let body: TBody = content;
    if (!body && render) {
      body = render.bind(this)(this);
    }
    if (formProps) {
      body = (
        <Form
          {..._.omit(formProps, ['action', 'method', 'valuesFilter', 'onSubmitted', 'onError'])}
        >
          {body}
        </Form>
      );
    }
    return <Modal {...modalProps}>{body}</Modal>;
  }
}

interface TOptionsWithState extends TOptions {
  state?: any;
}
Dialog.open = options => {
  const { action, method = 'POST', onSubmitted, autodata, ...restOptions } = options;
  options = _.merge(
    {
      title: '弹窗',
      delay: 0,
      setPropsMergetd: false,
      autoClose: false,
      maskClosable: false,
      transition: false,
      autodata: autodata && (Array.isArray(autodata) ? autodata : [autodata]),
      formProps: {
        action,
        method,
        onSubmitted,
        onSubmit(this: DialogInstance, e: React.FormEvent<HTMLFormElement>) {
          e && e.preventDefault();
          const { autoClose, formProps, setProps, form } = this.props;
          if (!formProps) return;
          const { action, method, valuesFilter, onSubmitted, onError } = formProps;
          if (!form) return;
          if (action) {
            form.validateFields(async (err: string[], body: object) => {
              if (err) return;
              setProps && setProps({ confirmLoading: true });
              if (_.isFunction(valuesFilter)) {
                body = valuesFilter.bind(this)(body);
              }
              const args = { method };
              if (method === 'GET') {
                Object.assign(args, { params: body });
              } else {
                Object.assign(args, { data: body });
              }
              const res = await request(action, args);
              if (res[RESPONSECODE] === 0) {
                _.isFunction(onSubmitted) && onSubmitted.bind(this)(res[RESPONSEDATA], args);
                autoClose && this.destroy();
              } else {
                setProps && setProps({ confirmLoading: false });
                _.isFunction(onError) && onError.bind(this);
              }
            });
          } else {
            form.validateFields((err: string[], body: object) => {
              if (err) return;
              _.isFunction(onSubmitted) && onSubmitted.bind(this)(body);
              autoClose && this.destroy();
            });
          }
        },
      },
      onOk(this: DialogInstance, event) {
        // if (this.props.formProps.action) {
        if (this.props.formProps) {
          this.props.formProps.onSubmit && this.props.formProps.onSubmit.bind(this)(event);
        } else {
          this.destroy();
        }
      },
      onCancel(this: DialogInstance) {
        this.destroy();
      },
    },
    restOptions,
  ) as TOptionsWithState;

  setTimeout(() => {
    const container = document.createElement('div');
    const { setPropsMerged, autodata } = options;
    const { render, ...methods } = _.pickBy(options, _.isFunction);
    const saveRef = (instance: any) => {
      if (instance) {
        _.merge(instance, {
          destroy() {
            const { onDestroy } = instance;
            _.isFunction(onDestroy) && onDestroy();
            ReactDOM.unmountComponentAtNode(container);
            document.body.removeChild(container);
          },
        });
        _.forEach(methods, (method, key) => {
          instance[key] = method.bind(instance);
        });
        const { state } = options;
        state && instance.setState(state);
        instance.props.forceUpdateProps();
      }
    };

    let WrappedComponent: React.ComponentType<any> = Dialog;
    WrappedComponent = withRef(WrappedComponent);
    WrappedComponent = withSetProps(setPropsMerged)(WrappedComponent);
    WrappedComponent = FormCreate()(WrappedComponent);
    if (autodata && Array.isArray(autodata)) {
      autodata.forEach((option: TOptionsAutodata) => {
        WrappedComponent = withAutodata(option)(WrappedComponent);
      });
    }

    document.body.appendChild(container);
    ReactDOM.render(<WrappedComponent {...options} getInstance={saveRef} />, container);
  }, options.delay);
};

Dialog.prompt = options => {
  const {
    label,
    title = `请输入${label}`,
    wrappedClassName,
    className,
    action,
    method = 'POST',
    name = 'name',
    required = true,
    type,
    message = `${label}不能为空`,
    component: Component = Input,
    defaultValue: initialValue,
    placeholder = title,
    valuesFilter,
    titleRender,
    onSubmitted,
    ...restOptions
  } = options;

  options = _.merge(
    {
      title,
      width: 450,
      formProps: {
        action,
        method,
        valuesFilter,
        onSubmitted,
      },
      titleRender,
      render(this: any) {
        const {
          form: { getFieldDecorator },
        } = this.props;
        const rules: ValidationRule[] = [];
        const rule = _.pickBy({ required, type });
        if (!_.isEmpty(rule)) {
          rules.push({ ...rule, message });
        }
        const mergeOptionsToProps = {
          className: classnames('blocked', className),
          size: 'large',
          placeholder,
          ...restOptions,
        };
        return (
          <FormItem className={wrappedClassName}>
            {getFieldDecorator(name, { initialValue, rules })(
              <Component {...mergeOptionsToProps} />,
            )}
          </FormItem>
        );
      },
    },
    restOptions,
  ) as any;
  Dialog.open(options);
};
