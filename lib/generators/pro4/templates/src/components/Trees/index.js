import React from 'react';
import AutoLoadTree from '../AdvancedTree/AutoLoadTree';

export const FullDeptTree = props => <AutoLoadTree url="/api/personnel/department" {...props} />;

export const OfferDeptTree = props => (
  <AutoLoadTree url="/api/personnel/departmentByEmployee" {...props} />
);
