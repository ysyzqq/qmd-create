import React, { useCallback } from 'react';
import { Modal, Row, Col, Form, Button, Icon } from 'antd';
import { InputCount, TextareaCount } from '../InputCount';
import styles from './index.less';
import { ModalProps } from 'antd/lib/modal';
import { FormComponentProps } from 'antd/es/form/Form';
import classNames from 'classnames';

export interface IInstationMsgModal extends ModalProps, FormComponentProps {
  userNum?: number;
  onlyText?: boolean;
  onAdd?: () => void;
  handleOk?: (args: { messageTitle: string; messageContent: string }) => void;
}

const InstationMsgModal: React.FC<IInstationMsgModal> = ({
  form: { getFieldDecorator, validateFields },
  userNum = 0,
  onlyText = false,
  onAdd = () => {},
  handleOk = () => {},
  ...restProps
}) => {
  const userNumValidator = useCallback(
    (rule, vlaues, callback) => {
      !userNum && callback('请选择发送对象');
      callback();
    },
    [userNum],
  );

  const handleModalOk = e => {
    validateFields({ force: true }, (err, values) => {
      if (!err) {
        handleOk(values);
      }
    });
  };

  /* 消息管理模块的渲染逻辑 */
  const renderUserChoose = userNum ? (
    <>
      {getFieldDecorator('userNum', {
        rules: [{ required: true, validator: userNumValidator }],
      })(
        <div>
          共<span style={{ color: '#F04844' }}>{userNum}</span>个对象
        </div>,
      )}
      <Button onClick={onAdd}>
        <Icon type="plus" />
        继续添加
      </Button>
    </>
  ) : (
    getFieldDecorator('userNum', {
      rules: [{ required: true, validator: userNumValidator }],
    })(
      <Button onClick={onAdd}>
        <Icon type="plus" />
        添加
      </Button>,
    )
  );
  return (
    <Modal {...restProps} onOk={handleModalOk}>
      <Row gutter={16}>
        <Col>
          <Form.Item
            label="发送对象"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            className={classNames(styles.formItemFlex, userNum && styles.noError)}
          >
            {onlyText
              ? getFieldDecorator('userNum', {
                  rules: [{ required: true, validator: userNumValidator }],
                })(
                  <div>
                    共<span style={{ color: '#F04844' }}>{userNum}</span>个对象
                  </div>,
                )
              : renderUserChoose}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col>
          <Form.Item label="标题" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('messageTitle', {
              rules: [{ required: true, message: '请输入标题!' }],
            })(<InputCount maxLength={20} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col>
          <Form.Item label="内容" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('messageContent', {
              rules: [{ required: true, message: '请填写站内信内容!' }],
            })(<TextareaCount rows={6} maxLength={100} style={{ resize: 'none' }} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} className={styles.tip}>
        <Col offset={4}>站内信标题不能超过20个字，内容不能超过100个字。 </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<IInstationMsgModal>({})(InstationMsgModal);
