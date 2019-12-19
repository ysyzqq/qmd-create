import React, { ReactNode } from 'react';
import { RouteContext, GridContent } from '@ant-design/pro-layout';
import { TabsProps } from 'antd/es/tabs';
import { PageHeader, Tabs } from 'antd';
import { PageHeaderProps } from 'antd/es/page-header';

interface PageHeaderTabConfig {
  tabList?: {
    key: string;
    tab: string | ReactNode;
    [propName: string]: any;
  }[];
  tabActiveKey?: TabsProps['activeKey'];
  onTabChange?: TabsProps['onChange'];
  tabBarExtraContent?: TabsProps['tabBarExtraContent'];
}
interface PageHeaderWrapperProps extends PageHeaderTabConfig, Omit<PageHeaderProps, 'title'> {
  title?: React.ReactNode | false;
  content?: React.ReactNode;
  extraContent?: React.ReactNode;
  pageHeaderRender?: (props: PageHeaderWrapperProps) => React.ReactNode;
}

const prefixedClassName = 'ant-pro-page-header-wrap';

const renderFooter: React.SFC<Omit<PageHeaderWrapperProps, 'title'>> = ({
  tabList,
  tabActiveKey,
  onTabChange,
  tabBarExtraContent,
}) => {
  if (tabList && tabList.length) {
    return (
      <Tabs
        className={`${prefixedClassName}-tabs`}
        activeKey={tabActiveKey}
        onChange={key => {
          if (onTabChange) {
            onTabChange(key);
          }
        }}
        tabBarExtraContent={tabBarExtraContent}
      >
        {tabList.map(item => (
          <Tabs.TabPane tab={item.tab} key={item.key} />
        ))}
      </Tabs>
    );
  }
  return null;
};
const defaultPageHeaderRender = (props: PageHeaderWrapperProps): React.ReactNode => {
  const { title, content, pageHeaderRender, extraContent, ...restProps } = props;

  return (
    <RouteContext.Consumer>
      {value => {
        if (pageHeaderRender) {
          return pageHeaderRender({ ...props, ...value });
        }
        let pageHeaderTitle = title;
        if (!title && title !== false) {
          pageHeaderTitle = value.title;
        }
        return (
          <PageHeader
            {...value}
            title={pageHeaderTitle}
            {...restProps}
            footer={renderFooter(restProps)}
          >
            {renderPageHeader(content, extraContent)}
          </PageHeader>
        );
      }}
    </RouteContext.Consumer>
  );
};
const renderPageHeader = (
  content: React.ReactNode,
  extraContent: React.ReactNode,
): React.ReactNode => {
  if (!content && !extraContent) {
    return null;
  }
  return (
    <div className={`${prefixedClassName}-detail`}>
      <div className={`${prefixedClassName}-main`}>
        <div className={`${prefixedClassName}-row`}>
          {content && <div className={`${prefixedClassName}-content`}>{content}</div>}
          {extraContent && (
            <div className={`${prefixedClassName}-extraContent`}>{extraContent}</div>
          )}
        </div>
      </div>
    </div>
  );
};
const PageHeaderWrapper: React.SFC<PageHeaderWrapperProps> = props => {
  const { children } = props;
  return (
    <div style={{ margin: '-24px -24px 0' }}>
      <div className={`${prefixedClassName}-page-header-warp`}>
        <div>{defaultPageHeaderRender(props)}</div>
      </div>
      {children ? <div className={`${prefixedClassName}-children-content`}>{children}</div> : null}
    </div>
  );
};

export { PageHeaderWrapper };
