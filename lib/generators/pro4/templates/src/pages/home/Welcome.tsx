import React from 'react';
// import { Card, Typography, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

const Home = () => {
  return (
    <>
      <PageHeaderWrapper title={false}></PageHeaderWrapper>
      <div className={styles.content}>欢迎进入商学院后台</div>
    </>
  );
};

export default Home;
