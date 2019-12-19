import React, { useEffect, useState, ReactNode } from 'react';
import classnames from 'classnames';
import styles from './index.less';

export interface IFixedBottom {
  className?: string;
  children?: ReactNode;
  fatherClassSelector?: string;
}
interface ContentField {
  field: string;
}
const FixedBottom: React.FC<IFixedBottom> & ContentField = ({
  className,
  children,
  fatherClassSelector = '.ant-pro-page-header-wrap-children-content',
}) => {
  const [clientWidth, setclientWidth] = useState<number | null>(null);
  useEffect(() => {
    function handleResize() {
      const pageHeaderWrapContent = document.querySelector(fatherClassSelector);
      setclientWidth(pageHeaderWrapContent && pageHeaderWrapContent.clientWidth);
    }
    handleResize();
    setTimeout(handleResize, 300);
    window.addEventListener('resize', handleResize);
    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  }, [children]);

  return (
    <div
      className={classnames(styles.fixedBottom, className)}
      style={{ width: clientWidth || 'inherit' }}
    >
      {children}
    </div>
  );
};
FixedBottom.field = 'fixedBottom';
export default FixedBottom;
