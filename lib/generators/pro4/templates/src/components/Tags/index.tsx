import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

const Tags = ({ children }) => {
  const tags = children.map((_, index) => (
    <Button className={styles.tag} key={index + 1}>
      <span> {_.tagName} </span>
      <span className={styles.badge}>({_.num}）</span>
    </Button>
  ));

  return <div className={styles.tags}>{tags}</div>;
};

export default Tags;
