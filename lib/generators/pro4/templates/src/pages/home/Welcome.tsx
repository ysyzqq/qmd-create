import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

const Home = () => {
  return (
    <>
      <PageHeaderWrapper title={false}></PageHeaderWrapper>
      <div className={styles.content}>欢迎进入<%= name %></div>
    </>
  );
};

export default Home;
