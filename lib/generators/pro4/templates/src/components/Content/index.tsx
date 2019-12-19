import React, { ReactNode } from 'react';
import classnames from 'classnames'
import styles from './index.less';

interface IContent {
  searchBar?: ReactNode;
  tableCard?: ReactNode;
  tableCardCls?: string;
}

const Content: React.FC<IContent> = ({ searchBar, tableCard, children, tableCardCls }) => {
  searchBar = searchBar || null;
  tableCard = tableCard || null;
  let others: any[] = [], hasFixedBottom;
  React.Children.forEach(children, (element: any, i: number) => {
    if (element == null) return;
    if (element.type.field === 'search') {
      searchBar = element;
    } else if (element.type.field === 'search') {
      tableCard = element;
    } else {
      others.push(element)
    }
    if (element.type.field === 'fixedBottom'){
      hasFixedBottom = true;
    }
  });
  return (
    <div className={classnames(hasFixedBottom && styles.hasFixedBottom)}>
      {searchBar && <div className={styles.searchBar}>{searchBar}</div>}
      {tableCard && <div className={classnames(styles.tableCard, tableCardCls)}>{tableCard}</div>}
      {others}
    </div>
  );
};

export default Content;
