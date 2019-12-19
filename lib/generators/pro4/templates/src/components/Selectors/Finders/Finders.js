import React, { PureComponent } from 'react';
import DefaultFinder from './Finder';

/* eslint-disable react/no-multi-comp */

export default class Finder extends PureComponent {
  render() {
    const { type, ...restProps } = this.props;
    switch (type) {
      case 'staff': return <StaffFinder {...restProps} />
      case 'post': return <PostFinder {...restProps} />
      case 'rank': return <RankFinder {...restProps} />
      case 'subject': return <SubjectFinder {...restProps} />
      case 'ldap': return <LdapFinder {...restProps} />
      case 'station': return <StationFinder {...restProps} />
      case 'role': return <RoleFinder {...restProps} />
      default: return <DefaultFinder {...restProps} />
    }
  }
}

export class StaffFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/manage/operate/all/user', //'/api/personnel/employee/think',
      keyName: 'id',
      labelName: 'name',
      searchName: 'name',
      defaultName: 'defaultItem',
      placeholder: '查找员工',
      searchOnFocus: false,
      renderLabel: i => `${i.name || ''}${i.jobNum ? ` (${i.jobNum})` : ''}${i.jobName ? ` / ${i.jobName}` : ''}`,
    }
    return <DefaultFinder type="staff" {...defaultProps} {...this.props} />;
  }
}

export class HrbpAndLeaderFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/api/personnel/employee/hrbpAndLeaderThink',
      keyName: 'id',
      labelName: 'name',
      searchName: 'name',
      defaultName: 'defaultItem',
      placeholder: '查找hrbp',
    }
    return <DefaultFinder type="hrbp" {...defaultProps} {...this.props} />;
  }
}

export class HrbpFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/api/personnel/employee/hrbpThink',
      keyName: 'id',
      labelName: 'name',
      searchName: 'name',
      defaultName: 'defaultItem',
      placeholder: '查找hrbp',
    }
    return <DefaultFinder type="hrbp" {...defaultProps} {...this.props} />;
  }
}

export class PostFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/api/personnel/job/listAll',
      keyName: 'id',
      labelName: 'name',
      searchName: 'searchValue',
      defaultName: 'defaultItem',
      placeholder: '查找职位',
    }
    return <DefaultFinder {...defaultProps} {...this.props} />;
  }
}

export class RankFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/api/personnel/joblevel/listAll',
      keyName: 'id',
      labelName: 'name',
      searchName: 'searchValue',
      defaultName: 'defaultItem',
      placeholder: '查找职级',
    }
    return <DefaultFinder {...defaultProps} {...this.props} />;
  }
}

export class SubjectFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/api/main/listAll',
      keyName: 'id',
      labelName: 'name',
      searchName: 'searchValue',
      defaultName: 'defaultItem',
      placeholder: '查找公司',
    }
    return <DefaultFinder type="subject" style={{ minWidth: '100%', maxWidth: 0 }} {...defaultProps} {...this.props} />;
  }
}

export class OfferStaffFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/api/personnel/employees/search',
      keyName: 'id',
      labelName: 'name',
      searchName: 'name',
      defaultName: 'defaultItem',
      placeholder: '查找员工',
      searchOnFocus: false,
      renderLabel: i => `${i.name || ''}${i.jobNum ? ` (${i.jobNum})` : ''}${i.jobName ? ` / ${i.jobName}` : ''}`,
    }
    return <DefaultFinder type="offerStaff" style={{ minWidth: '100%', maxWidth: 0 }} {...defaultProps} {...this.props} />;
  }
}

export class OfferCompanyFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/api/companyDepartments/companys/list',
      keyName: 'id',
      labelName: 'name',
      searchName: 'key',
      defaultName: 'defaultItem',
      placeholder: '查找公司',
    }
    return <DefaultFinder type="offerCompany" style={{ minWidth: '100%', maxWidth: 0 }} {...defaultProps} {...this.props} />;
  }
}

export const LdapFinder = props => {
  const defaultProps = {
    url: '/api/recruit/joinProc/getLdapAccounts',
    keyName: 'username',
    labelName: 'givenName',
    searchName: 'keyword',
    defaultName: 'defaultItem',
    placeholder: 'ldap账号',
    valueType: 'string',
  }
  return <DefaultFinder {...defaultProps} {...props} />;
}

export const StationFinder = props => {
  const defaultProps = {
    url: '/api/workingSeat/think',
    keyName: 'id',
    labelName: 'addressAndSeatNum',
    searchName: 'seatNum',
    defaultName: 'defaultItem',
    placeholder: '工位选择',
  }
  return <DefaultFinder {...defaultProps} {...props} />;
}

export const RoleFinder = props => {
  const defaultProps = {
    url: '/api/personnel/employeemgr/getRoleListAll',
    keyName: 'id',
    labelName: 'name',
    searchName: 'searchValue',
    defaultName: 'defaultItem',
    placeholder: '角色选择',
  }
  return <DefaultFinder {...defaultProps} {...props} />;
}


export class JdFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/api/vacateBack/getVacateNumList',
      keyName: 'vacationId',
      labelName: 'vacationNum',
      showSearch: false,
      // searchName: 'searchValue',
      // defaultName: 'defaultItem',
      placeholder: '关联假期',
    }
    return <DefaultFinder {...defaultProps} {...this.props} />;
  }
}

export class ArrivalChecksFinder extends PureComponent {
  render() {
    const defaultProps = {
      url: '/api/recruit/getArrivalChecks',
      keyName: 'userId',
      labelName: 'givenName',
      placeholder: '入职确认',
      defaultName: 'defaultItem',
    }
    return <DefaultFinder {...defaultProps} {...this.props} />;
  }
}
