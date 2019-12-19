import React, { PureComponent } from 'react'
import TreeSelector from './TreeSelector'

/* eslint-disable react/no-multi-comp */

export class Departments extends PureComponent {
  render() {
    const tsProps = {
      placeholder: '请选择部门',
      ...this.props,
    }
    return <TreeSelector {...tsProps} />
  }
}

export class OfferDepartments extends PureComponent {
  render() {
    return <Departments {...this.props} url="/api/personnel/departmentByEmployee?type=1" />
  }
}

export class AllDepartments extends PureComponent {
  render() {
    return <Departments {...this.props} url="/manage/department/oa/list" />
  }
}