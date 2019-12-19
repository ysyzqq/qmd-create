import React, { useState } from 'react';
import { Modal, Row, Col } from 'antd';
import { CommonTable } from '@/components';
import { ModalProps } from 'antd/lib/modal';
import styles from './index.less';
import { IUserListItem } from '@/pages/account/services/interface';

export interface IAccountTableModal extends ModalProps {
  onConfirm?: (keys: number[], e: any) => void;
}
const AccountTableModal: React.FC<IAccountTableModal> = ({
  onConfirm = () => {},
  ...restProps
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const columns = [
    {
      title: '用户id',
      dataIndex: 'id',
    },
    {
      title: '用户账号',
      dataIndex: 'account',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      render: (value, record: IUserListItem) => (
        <Row>
          <Col span={24}>
            <a href={`/account/detail/${record.id}`}>查看</a>
          </Col>
        </Row>
      ),
    },
  ];

  const handleSelectChange = (total: number, selectedRowKeys: any, unSelectedRowKeys?: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleOk = e => {
    onConfirm(selectedRowKeys, e);
  };

  return (
    <Modal
      title="用户列表"
      onOk={handleOk}
      {...restProps}
      width={900}
      className={styles.tableModal}
    >
      <CommonTable
        autosubmit
        autoRowSelection={{
          auto: true,
          onSelectChange: handleSelectChange,
        }}
        autoIndex={false}
        columns={columns}
        api={{
          url: '/manage/user/getuserList',
          data: {},
          method: 'GET',
        }}
        // scroll={{ y: height - 54 - 64 }}
      />
    </Modal>
  );
};

export default AccountTableModal;
