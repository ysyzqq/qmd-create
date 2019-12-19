/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import Searcher from './Searcher'
import { OfferStaffFinder } from '../Finders'
import { OfferDeptTree, FullDeptTree } from '../../Trees';

export class InStaffSearcher extends PureComponent {
  render() {
    const searcherProps = {
      tree: FullDeptTree,
      finderProps: {
        url: '/api/personnel/employees/processPermissionThink',
        renderLabel: i => `${i.name || ''}${i.jobNum ? ` (${i.jobNum})` : ''}${i.jobName ? ` / ${i.jobName}` : ''}`,
      },
      listUrl: '/api/personnel/employees/getProcessPermissionEmployee',
      ...this.props,
    }
    return <Searcher {...searcherProps} />
  }
}

export class OfferStaffSearcher extends PureComponent {
  render() {
    const searcherProps = {
      tree: OfferDeptTree,
      finder: OfferStaffFinder,
      ...this.props,
    }
    return <Searcher {...searcherProps} />
  }
}

export class ForwardStaffSearcher extends PureComponent {
  render() {
    const searcherProps = {
      tree: FullDeptTree,
      finderProps: {
        url: '/api/personnel/employees/forwardEmployeesSearchPc',
        renderLabel: i => `${i.name || ''}${i.jobNum ? ` (${i.jobNum})` : ''}${i.jobName ? ` / ${i.jobName}` : ''}`,
      },
      listUrl: '/api/personnel/employees/forwardEmployees',
      listQuery: true,
      ...this.props,
    }
    return <Searcher {...searcherProps} />
  }
}