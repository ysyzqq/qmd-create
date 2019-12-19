import { Form, Input, Button, message } from 'antd';
import React, { useCallback } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import logo from '@/assets/weiLogo.png';

const FormItem = Form.Item;
const Login = props => {
  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
  } = props;
  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    validateFields((err, val) => {
      if (err) return;
      try {
        dispatch({
          type: 'login/login',
          payload: {
            ...val,
            // type,
          },
        });
      } catch (error) {
        throw error;
      }
      message.success('登录成功');
    });
  }, []);
  return (
    <div className={styles.wrap}>
      <div className={styles.logBar}>
        <img src={logo} alt="logo" className={styles.logo_img}></img>
        <span className={styles.logo_title}>商学院后台管理</span>
      </div>

      <div className={styles.login_wrap}>
        <Form onSubmit={handleSubmit} hideRequiredMark labelAlign="left">
          <div className={styles.login_title}>登录</div>
          <FormItem label="用户名" colon={false}>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(<Input placeholder="请输入用户名" />)}
          </FormItem>
          <Form.Item label="密码" colon={false}>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入用户密码!' }],
            })(<Input type="password" placeholder="请输入用户密码" />)}
          </Form.Item>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Form.create({})(Login));
