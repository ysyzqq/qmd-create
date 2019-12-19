import React, { useState, useEffect, forwardRef } from 'react';
import { Upload, Icon, message, Button, Modal } from 'antd';
import _ from 'lodash';
import styles from './index.less';

const PreviewImg = props => {
  const [visible, setVisible] = useState(false);
  const { url } = props;

  const previewImage = (
    <Modal
      visible={visible}
      footer={null}
      bodyStyle={{padding:40}}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <img src={url} alt="广告图片" className={styles.img_preview}></img>;
    </Modal>
  );

  return (
    <span>
      {visible&&previewImage}
      <img
        src={url}
        alt="广告图片"
        className={styles.img_wrap}
        onClick={() => setVisible(true)}
      ></img>
    </span>
  );
};

export default PreviewImg;
