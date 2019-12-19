import React, { useState, useMemo, useCallback } from 'react';
import { Modal, Row, Col, Form, Input, Button, Icon } from 'antd';
import styles from './index.less';
import { InputCount, TextareaCount } from '../InputCount';
import { ModalProps } from 'antd/lib/modal';
import { WrappedFormUtils, FormComponentProps } from 'antd/es/form/Form';
import classNames from 'classnames';

const { TextArea } = Input;

export interface IShortMsgModal extends ModalProps, FormComponentProps {
  userNum?: number;
  onlyText?: boolean;
  onAdd?: () => void;
  handleOk?: (args: { messageContent: string }) => void;
}

const ShortMsgModal: React.FC<IShortMsgModal> = ({
  form: { getFieldDecorator, validateFields },
  userNum = 0,
  onlyText = false,
  onAdd = () => {},
  handleOk = () => {},
  ...restProps
}) => {
  const [message, setMessage] = useState<string>('');

  const handleTextAreaChange = value => {
    setMessage(value);
  };

  const userNumValidator = useCallback(
    (rule, values, callback) => {
      !userNum && callback('请选择发送对象');
      callback();
    },
    [userNum],
  );

  const msgNumValidator = (rule, vlaues, callback) => {
    !userNum && callback('发送条数不能为空');
    callback();
  };

  const handleModalOk = e => {
    validateFields({ force: true }, (err, values) => {
      if (!err) {
        handleOk(values);
      }
    });
  };

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
          <Form.Item label="短信内容" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('messageContent', {
              rules: [{ required: true, message: '请填写短信内容!' }],
            })(
              <TextareaCount
                rows={6}
                onChange={handleTextAreaChange}
                maxLength={500}
                style={{ resize: 'none' }}
                ignore
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} className={styles.tip}>
        <Col offset={4}>
          发送时系统会自动在结尾追加【商学院】，请勿重复添加。 内容上限不能超过
          <span style={{ color: '#F04844' }}>500</span>字，当前已输入
          <span style={{ color: '#F04844' }}>{message.length}</span>字
        </Col>
      </Row>
      <Row gutter={16}>
        <Col>
          <Form.Item
            label="发送统计"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            className={classNames(styles.shortLastItem, userNum && styles.noError)}
          >
            {getFieldDecorator('msgNum', {
              rules: [{ required: true, validator: msgNumValidator }],
            })(<div>发送条数:{userNum} 条</div>)}
          </Form.Item>
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<IShortMsgModal>()(ShortMsgModal);
