import React from 'react';
import { RouteContext } from '@ant-design/pro-layout';
import { Breadcrumb } from 'antd';
import styles from './index.less';

const PageBreadcrumb = () => (
  <RouteContext.Consumer>
    {value => {
      const currentRoutes = (value as any).breadcrumb.routes || [];
      return (
        <Breadcrumb className={styles.breadcrumb}>
          {currentRoutes.map(_ => (
            <Breadcrumb.Item>{_.breadcrumbName}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
      );
    }}
  </RouteContext.Consumer>
);

export default PageBreadcrumb;
